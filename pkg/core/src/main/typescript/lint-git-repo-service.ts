import path from "path";

import { RuntimeError } from "run-time-error";
import axios, { AxiosError } from "axios";
import fs from "fs-extra";
import fg from "fast-glob";
import { v4 as uuidv4 } from "uuid";
import temp from "temp";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";

import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";
import {
  LinterError,
  LintGitRepoRequest,
  LintGitRepoResponse,
  LintGitRepoResponseOutcomeEnum,
} from "@dci-lint/core-api";

import { isAxiosError } from "@dci-lint/core-api";

import { IgnoreFileParser } from "./ignore-file-parser";

export interface ILintGitRepoServiceOptions {
  logLevel?: LogLevelDesc;
  ignoreFileParser?: IgnoreFileParser;
}

export class LintGitRepoService {
  public static readonly CLASS_NAME = "LintGitRepoService";

  private readonly log: Logger;
  private readonly ignoreFileParser: IgnoreFileParser;

  public get className() {
    return LintGitRepoService.CLASS_NAME;
  }

  constructor(public readonly opts: ILintGitRepoServiceOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg options`);

    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.ignoreFileParser =
      opts.ignoreFileParser || new IgnoreFileParser({ logLevel: level });
    Checks.truthy(this.ignoreFileParser, `${fnTag}:this.ignoreFileParser`);
  }

  public async run(req: LintGitRepoRequest): Promise<LintGitRepoResponse> {
    this.log.debug("Linting Github Organization...", req);
    const localRepoDirName = uuidv4();
    // Automatically track and cleanup files at exit
    temp.track();

    const workspace = temp.mkdirSync(uuidv4());
    const gitRootDir = path.join(workspace, localRepoDirName);
    this.log.debug("Git root dir=%o", gitRootDir);
    try {
      const options: SimpleGitOptions = {
        baseDir: workspace,
        binary: "git",
        maxConcurrentProcesses: 1,
      };

      let defaultTargetPhrasePatterns: string[] = [];
      if (req.configDefaultsUrl) {
        const url = req.configDefaultsUrl;
        try {
          const { data, status } = await axios.get<LintGitRepoRequest>(url);
          this.log.debug(`Received config defaults from URL: ${url}`);
          this.log.debug(`Config defaults status: %o, data: %o`, status, data);
          defaultTargetPhrasePatterns = data.targetPhrasePatterns;
        } catch (ex) {
          if (isAxiosError(ex)) {
            throw new RuntimeError(`Fail: HTTP GET config URL: ${url}`, ex);
          } else if (ex instanceof Error) {
            throw new RuntimeError("Fail: Invocation of Axios HTTP GET", ex);
          } else {
            throw new RuntimeError(
              "Fail: Invocation of Axios HTTP GET",
              JSON.stringify(ex)
            );
          }
        }
      }
      const effectiveTargetPhrasePatterns = defaultTargetPhrasePatterns
        ? req.targetPhrasePatterns.concat(defaultTargetPhrasePatterns)
        : req.targetPhrasePatterns;

      this.log.debug(
        "Effective Target Phrase Patterns: %o",
        effectiveTargetPhrasePatterns
      );

      // Create a dummy git repository locally that we'll clone in the lint git repo svc
      const git: SimpleGit = simpleGit(options);
      const cloneResult = await git.clone(req.cloneUrl, localRepoDirName);
      this.log.debug(`CloneResult=%o`, cloneResult);
      const cwdRes = await git.cwd(gitRootDir);
      this.log.debug("SimpleGit CWD Out=%o", cwdRes);

      const pullAllRes = await git.raw(["pull", "--all"]);
      this.log.debug("git pull --all => %o", pullAllRes);

      const checkoutArgs = req.checkoutArgs || [];
      this.log.debug("Effective checkoutArgs=%o", checkoutArgs);
      if (checkoutArgs.length > 0) {
        this.log.debug("Executing git checkout...");
        // Casting here because the documentation says it's ok to use Arrays,
        // but the typings are written to only accept strings.
        const out = await git.checkout(checkoutArgs.join(" "));
        this.log.debug("Checkout Result=%o", out);
      } else {
        this.log.debug("Skipped git checkout due to no args in request.");
      }

      // If not overridden by the request, then we search all files.
      const includePatterns = req.includeFilePatterns || ["**"];

      // By default we exclude the .git/ directory because it contains a bunch
      // of binary files for the most part.
      const excludePatterns = req.excludeFilePatterns || [".git"];

      const dciLintIgnoreFilePath = path.join(gitRootDir, ".dcilintignore");
      const ignoreFileExists = await fs.pathExists(dciLintIgnoreFilePath);
      if (ignoreFileExists) {
        this.log.debug(`Ignore file exists. Parsing it...`);
        const ignoreGlobPatterns = await this.ignoreFileParser.parse({
          path: dciLintIgnoreFilePath,
        });
        this.log.debug(`Ignore file parsed into: %o`, ignoreGlobPatterns);
        ignoreGlobPatterns.forEach((ptrn) => excludePatterns.push(ptrn));
      } else {
        this.log.debug(`No ignore file exists. Skipping parsing...`);
      }

      this.log.debug(`Effective include patterns: %o`, includePatterns);
      this.log.debug(`Effective exclude patterns: %o`, excludePatterns);

      const stream = fg.stream(includePatterns, {
        cwd: gitRootDir,
        dot: true,
        ignore: excludePatterns,
      });

      let linterErrors: LinterError[] = [];
      for await (const entry of stream) {
        this.log.debug(`Linting: %o`, entry);

        const entryPath = path.join(gitRootDir, entry as string);
        const contents = await fs.readFile(entryPath, "utf-8");
        const hits = effectiveTargetPhrasePatterns
          .map((p: string) => contents.match(p))
          .filter((m: RegExpMatchArray | null) => m != null)
          .map(
            (m: RegExpMatchArray | null) =>
              ({
                file: entry,
                targetPhrasePatterns: m as string[],
              } as LinterError)
          );

        this.log.debug(`Hits=%o`, hits);

        linterErrors = linterErrors.concat(hits);
      }

      const res: LintGitRepoResponse = {
        linterErrors,
        cloneUrl: req.cloneUrl,
        outcome: LintGitRepoResponseOutcomeEnum.Success,
      };

      this.log.debug("Linting git repository OK");
      return res;
    } catch (ex) {
      this.log.error("Linting git repository Failed: ", ex);
      throw ex;
    }
  }
}

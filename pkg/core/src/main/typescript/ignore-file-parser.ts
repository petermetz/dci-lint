import fs from "fs-extra";
import readline from "readline";

import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";

export interface IIgnoreFileParserOptions {
  logLevel?: LogLevelDesc;
}

/**
 * Options iterface describing what options can the callers specify when
 * invoking the {IgnoreFileParser#parse()} method.
 */
export interface IParseOptions {
  /**
   * The path on the file-system pointing to a .dcilintignore file that is
   * assumed to contain one ignore glob pattern per line.
   * The file pointed at can also have comments that start with a hashmark
   * similarly how you can do the same for .gitignore files as well, though the
   * number of supported syntax options here may be much more limited compared
   * to whatever git is offering.
   */
  path: string;
}

export class IgnoreFileParser {
  public static readonly CLASS_NAME = "IgnoreFileParser";

  private readonly log: Logger;

  public get className() {
    return IgnoreFileParser.CLASS_NAME;
  }

  constructor(public readonly options: IIgnoreFileParserOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.log.debug(`Created instance OK`);
  }

  /**
   * Parses a .dcilintignore configuration file on the file-system into an
   * arrya of glob patterns that can be used by the linter for ignoring files
   * that the author of the git repo explicitly excluded from linting.
   *
   * The line by line reading implementation is based on this example:
   * https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
   *
   * @param options The object describing the options for the parsing task such
   * as the file path that needs to be parsed.
   */
  public async parse(options: { path: string }): Promise<string[]> {
    const fnTag = `${this.className}#parse()`;
    const ignoreGlobPatterns: string[] = [];

    Checks.truthy(options, `${fnTag}:options`);
    Checks.nonBlankString(options.path, `${fnTag}:options.path`);

    const fileExistsAtPath = await fs.pathExists(options.path);
    Checks.truthy(fileExistsAtPath, `${fnTag}:fileExistsAtPath`);

    const fileStream = fs.createReadStream(options.path);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
      const trim = line.trim();
      // Each line in the file will be successively available here as `line`.
      if (trim.startsWith("#")) {
        this.log.debug(`Dropped commented config line: ${line}`);
      } else if (trim.length < 1) {
        this.log.debug(`Dropped empty config line.`);
      } else {
        this.log.debug(`Added line from ignore patterns: ${line}`);
        ignoreGlobPatterns.push(trim);
      }
    }

    return ignoreGlobPatterns;
  }
}

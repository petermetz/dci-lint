import path from "path";

import test, { Test } from "tape-promise/tape";
import temp from "temp";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

import { LintGitRepoService } from "../../../main/typescript";

import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";

import { LogLevelDesc } from "@dci-lint/common";

const logLevel: LogLevelDesc = "INFO";

test("finds target word in git repo", async (t: Test) => {
  const label = "./dci-lint-core-test-lint-git-repo-service/";
  const targetPhrasePatterns = [uuidv4()];
  const commitMessage = uuidv4();
  const okFileContents = uuidv4();
  const okFilename = `${uuidv4()}.txt`;

  const badFilename = `${uuidv4()}.txt`;
  const badFileContents = `something
  ${targetPhrasePatterns[0]}
  something`;

  // Automatically track and cleanup files at exit
  temp.track();

  const testDir = temp.mkdirSync(label);
  const cloneUrl = `file://${testDir}`;

  const okFilePath = path.join(testDir, okFilename);
  await fs.writeFile(okFilePath, okFileContents);

  const badFilePath = path.join(testDir, badFilename);
  await fs.writeFile(badFilePath, badFileContents);

  t.comment(`Base directory for test files: ${testDir}`);
  t.comment(`Test file path in git: ${okFilePath}`);

  const options: SimpleGitOptions = {
    baseDir: testDir,
    binary: "git",
    maxConcurrentProcesses: 1,
  };

  // Create a dummy git repository locally that we'll clone in the lint git repo svc
  const git: SimpleGit = simpleGit(options);
  await git.init([]);
  await git.addConfig("user.name", "DCI Lint Test User");
  await git.addConfig("user.email", "<dci-lint-test-user@example.com>");
  await git.addConfig("commit.gpgSign", "false");
  await git.add([okFilePath, badFilePath]);
  await git.commit(commitMessage);

  const svc = new LintGitRepoService({ logLevel });

  const res = await svc.run({
    cloneUrl,
    targetPhrasePatterns,
  });
  t.ok(res, "Response from linter truthy OK");
  t.ok(res.linterErrors, "res.linterErrors truthy OK");
  t.ok(res.linterErrors.length > 0, "res.linterErrors.length > 1 truthy OK");

  t.end();
});

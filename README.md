
# DCI Lint

Lints your git repositories for inclusive language.

# Usage

## Public test instance

Accessible at: https://dci-lint.herokuapp.com/

## Self-hosting on your own hardware

You can self host DCI-lint by running the container image as shown below,
after which you can access the GUI locally at http:/localhost:3000

```sh
docker run --rm -e PORT=3000 -p 3000:3000 ghcr.io/petermetz/dci-lint:0.5.1
```

If you'd rather use the command line interface instead of the web interface,
you can do so via the container as well:

```sh
docker \
  run \
  --rm \
  --env DCI_LINT_LOG_LEVEL=DEBUG \
  ghcr.io/petermetz/dci-lint:0.5.1 \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js \
  lint-git-repo \
  --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"]}'
```


## Command Line Interface

After the project has been built, the CLI can be invoked as follows:

```sh
DCI_LINT_LOG_LEVEL=ERROR node \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js   \
  lint-git-repo   --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"], "checkoutArgs": ["v0.5.0"]}'
```

Running the command above will produce something like this printed to the standard out of your terminal:
```json
{
  "linterErrors": [],
  "cloneUrl": "https://github.com/petermetz/dci-lint.git",
  "outcome": "dci-lint.lint-git-repo-response.outcome.SUCCESS"
}
```

Notice how the `--request` parameter takes the
exact same JSON that you'd normally send
through HTTP to the REST API. This is because
that's exactly what's happening behind the scenes:
The CLI just pulls up an API server and sends in
the one-off request specified and then shuts it down.

The exit code of the OS process itself depends on
whether the linter found any errors or not.
If there were no errors then the exit code is `0`
otherwise it's `2`, indicating an issue.

To avoid the response being pretty-printed JSON, you can pass in the `--prety=false` flag via the CLI in addition to the `--request='{...}'` parameter. This will cause the JSON output to be printed on a single line.

## Build container image locally

```sh
DOCKER_BUILDKIT=1 docker build --build-arg NPM_PKG_VERSION=latest -f ./Dockerfile . -t dcil
```

## Run locally via Docker

```sh
docker \
  run \
  --rm \
  dcil \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js \
  lint-git-repo \
  --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"]}'
```

# Documentation

Is scarce.

# Contributing

Open an issue before working on a pull request to ensure proper alignment.

# Development

Make sure to install `nodemon` globally if you'll be using the `yarn watch` script
for automatic builds on source code changes.
You can find more information about why this is needed in the [npm-watch](https://github.com/M-Zuber/npm-watch#common-issues) package's documentation.

# License

Dual licensed under `Apahce-2.0` and `MIT` (pick the one you like)

See: https://en.wikipedia.org/wiki/Software_Package_Data_Exchange

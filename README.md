
# DCI Lint

Lints your git repositories for inclusive language.

# Usage

## GitHub Action

Follow these instructions to set up a GitHub Action that automatically lints incoming pull requests to your repository: https://github.com/petermetz/gh-action-dci-lint#usage

## Public test instance

The GUI and the REST API are both accessible at these addresses (backed by the same free-tier [fly.io](https://fly.io) instance):
- https://dci-lint.top/
- https://www.dci-lint.top/
- https://dci-lint.fly.dev

## Self-hosting on your own hardware

You can self host DCI-lint by running the container image as shown below,
after which you can access the GUI locally at http://localhost:3000

```sh
docker run --rm -e PORT=3000 -p 3000:3000 ghcr.io/petermetz/dci-lint:0.6.4
```

If you'd rather use the command line interface instead of the web interface,
you can do so via the container as well:

```sh
docker \
  run \
  --rm \
  --env DCI_LINT_LOG_LEVEL=DEBUG \
  ghcr.io/petermetz/dci-lint:0.6.4 \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js \
  lint-git-repo \
  --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"]}'
```


## Command Line Interface

After the project has been built (`$ yarn configure`), the CLI can be invoked as follows:

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

To avoid the response being pretty-printed JSON, you can pass in the `--pretty=false` flag via the CLI in addition to the `--request='{...}'` parameter. This will cause the JSON output to be printed on a single line.

## Build release container image locally

```sh
DOCKER_BUILDKIT=1 docker build --build-arg NPM_PKG_VERSION=latest -f ./Dockerfile . -t dcil
```

## Run release container image locally via Docker

*One-off Linting Request via CLI arguments:*

```sh
docker \
  run \
  --rm \
  dcil \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js \
  lint-git-repo \
  --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"]}'
```

*Continuously Listen to Linting Requests via HTTP Server:*

```sh
docker \
  run \
  --rm \
  dcil \
  node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-server.js
```

## Build development container image locally

```sh
DOCKER_BUILDKIT=1 docker build -f ./src.Dockerfile . -t dcil
```

## Run development container image locally via Docker

*One-off Linting Request via CLI arguments:*

```sh
docker \
  run \
  --rm \
  dcil \
  pkg/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-cli.js \
  lint-git-repo \
  --request='{"cloneUrl": "https://github.com/petermetz/dci-lint.git", "targetPhrasePatterns": ["something-mean"]}'
```

*Continuously Listen to Linting Requests via HTTP Server:*

```sh
docker \
  run \
  --rm \
  --publish 3000:3000 \
  --publish 4000:4000 \
  dcil \
  pkg/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-server.js
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


# Publicly available set of recommendations

 https://inclusivenaming.org/configuration-dci-lint-recommended-v1.json

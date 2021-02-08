
# DCI Lint

Lints your git repositories for inclusive language.

# Usage

## Public test instance

Accessible at: https://dci-lint.herokuapp.com/

## Self-hosting on your own hardware

You can self host DCI-lint by running the container image as shown below,
after which you can access the GUI locally at http:/localhost:3000

```sh
docker run --rm -e PORT=3000 -p 3000:3000 petermetz/dci-lint:2021-01-29-9eaf276
```
## Documentation

Is scarce.

## Contributing

Open an issue before working on a pull request to ensure proper alignment.

## License

Dual licensed under `Apahce-2.0` and `MIT` (pick the one you like)

See: https://en.wikipedia.org/wiki/Software_Package_Data_Exchange

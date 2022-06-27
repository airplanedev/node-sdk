# Contributing

## Deployment

To release a new version of the SDK, open a PR that bumps the version in `package.json`. Once merged to `main`, this will trigger a publish via GitHub Actions. This will publish the package to npm and create a GitHub release with auto-generated release notes. If the version is a pre-release (e.g. `0.2.0-4`), it will tag with `@next`. Otherwise, it will tag with `@latest`.

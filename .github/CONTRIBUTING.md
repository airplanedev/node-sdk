# Contributing

## Deployment

To deploy a new version of this SDK, first merge your chages to `main`.

Then, deploy a new version with `np`:

```sh
# Run build to create the dist/ directory.
yarn build
# The --preview will do a dry-run.
# You may be prompted for 2FA authentication halfway ("waiting for input...").
npx np patch --preview
```

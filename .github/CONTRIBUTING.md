# Contributing

## Deployment

To deploy a new version of this SDK, first merge your chages to `main`.

Then, deploy a new version with `np`:

```sh
# The --preview will do a dry-run.
npx np patch --preview --any-branch
```

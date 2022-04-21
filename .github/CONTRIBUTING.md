# Contributing

## Deployment

To deploy a new version of this SDK, first merge your chages to `main`.

Then, deploy a new version with `np`:

```sh
# You may be prompted for 2FA authentication halfway ("waiting for input...").
npx np
# This previews the release. To release:
npx np --preview=false
```

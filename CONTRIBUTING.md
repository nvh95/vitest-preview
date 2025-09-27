Stay tuned. We are working on the guideline. But it's a standard monorepo, so you are likely familiar with it.

## Publishing

We use [changeset](https://pnpm.io/using-changesets) to manage the versioning and publishing of the packages.
Draft flow

1. Build all packages

```bash
pnpm run build
```

2. pnpm changeset
3. (Prerelease only) Enter pre mode

```bash
pnpm changeset pre enter alpha
```

4. pnpm changeset version
5. commit
6. pnpm changeset publish
7. Push commit and tag
8. (Prerelease only) Exit pre mode

```bash
pnpm changeset pre exit
```

Stay tuned. We are working on the guideline. But it's a standard monorepo, so you are likely familiar with it.

## Publishing

We use [changeset](https://pnpm.io/using-changesets) to manage the versioning and publishing of the packages.
Draft flow

1. pnpm changeset
2. pnpm changeset version
3. pnpm install
4. commit
5. pnpm publish -r

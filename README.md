# Workspace Documentation

This project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to manage multiple packages within a single repository.

## Structure

```
/PROJECTS/SHAWARMA/
├── package.json
├── yarn.lock
├── packages/
│   ├── package-a/
│   └── package-b/
└── README.md
```

- **package.json**: Root configuration for workspaces.
- **yarn.lock**: Dependency lock file.
- **packages/**: Directory containing individual workspace packages.

## Getting Started

1. **Install dependencies:**
  ```sh
  yarn install
  ```

2. **Add a new workspace:**
  - Create a new folder in `packages/`.
  - Add a `package.json` inside the new folder.
  - Update the root `package.json` `workspaces` field if necessary.

## Scripts

Run scripts across all workspaces:
```sh
yarn workspaces run <script>
```

Run a script in a specific workspace:
```sh
yarn workspace <workspace-name> <script>
```

## References

- [Yarn Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Managing Monorepos with Yarn](https://yarnpkg.com/features/workspaces)

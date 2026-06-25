# flang

`flang` is a programming language project built around a spec-driven workflow.

## Overview

The language source files use the `.f` extension.

The implementation strategy is to transpile `flang` source code into C and then compile the generated C with a standard compiler such as `clang` or `gcc`.

The transpiler project itself is bootstrapped with TypeScript.

## Tooling

The repository currently includes:

- TypeScript for the transpiler implementation
- ESLint for linting
- Prettier for formatting
- Lefthook for pre-commit hooks
- VS Code workspace settings in `.vscode/settings.json`

The initial source layout is:

- `src/`

Available scripts:

- `yarn build`
- `yarn start`
- `yarn start:dev`
- `yarn format`
- `yarn lint`
- `yarn type-check`

## Workflow

Every implementation must start with a spec stored in `.specs/`.

Spec filenames must follow this format:

```text
YYYYMMDDHHMMSS_name_of_the_spec
```

Implementation work should follow this order:

1. Create the relevant spec.
2. Refine the spec until the design is aligned.
3. Approve the spec.
4. Implement the change.

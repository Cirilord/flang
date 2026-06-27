# flang

`flang` is a programming language project built around a spec-driven workflow.

## Overview

The language source files use the `.f` extension.

The implementation strategy is to transpile `flang` source code into C and then compile the generated C with a standard compiler such as `clang` or `gcc`.

The transpiler project itself is bootstrapped with TypeScript.

## Tooling

The repository currently includes:

- TypeScript for the transpiler implementation
- `cac` for the command-line interface
- ESLint for linting
- Prettier for formatting
- Lefthook for pre-commit hooks
- VS Code workspace settings in `.vscode/settings.json`

The initial source layout is:

- `src/cli/`
- `src/`

Available scripts:

- `yarn build`
- `yarn start`
- `yarn start:dev`
- `yarn format`
- `yarn lint`
- `yarn type-check`

## CLI

The initial CLI is implemented with `cac`.

Current command:

```text
f compile <input>
```

Supported options:

```text
--target <target>
--tool <tool>
--output <output>
--transpile-only
```

The first CLI version only defines the command surface. The compile action is currently a stub until the transpilation pipeline is specified by later specs.

Current examples:

```text
f compile program.f --target c --tool clang --output bin/program
f compile program.f --target c --output generated/program.c --transpile-only
```

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

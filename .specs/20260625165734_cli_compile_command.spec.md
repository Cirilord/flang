# CLI Compile Command Spec

## Objective

Define the initial command-line interface for the `flang` transpiler project using `cac`, including the `compile` command, its options, and the relationship between `src/main.ts` and `src/cli`.

## Scope

In scope:

- Adding `cac` as the CLI library for the project
- Defining a CLI module rooted in `src/cli`
- Defining the initial `compile <input>` command
- Defining the supported options for the `compile` command
- Defining how `src/main.ts` must initialize and execute the CLI

Out of scope:

- Implementing the full transpilation pipeline
- Implementing C code generation
- Implementing invocation of a native C compiler
- Defining the full language semantics for `.f` files

## Design

- The project CLI must be implemented with `cac`.
- The main application entrypoint must remain `src/main.ts`.
- CLI setup code must live under `src/cli`.
- `src/main.ts` must delegate CLI initialization and execution to the CLI module instead of containing command definitions inline.
- The CLI must define a command named `compile` that requires a single positional argument named `input`.
- The `input` argument represents the path to a `flang` source file.
- The CLI must support an option named `target` that selects the transpilation target language or backend.
- The CLI must support an option named `tool` that selects the compiler or interpreter used after transpilation.
- The CLI must support an option named `output` that defines the output path used by the command result.
- The CLI must support an option named `transpile-only` that skips the tool execution step and only generates the target output.
- The `target` option must be required.
- The `output` option must be required.
- The `tool` option must be required when `transpile-only` is not enabled.
- The `tool` option may be omitted when `transpile-only` is enabled.
- When `transpile-only` is enabled, the `output` path must represent the generated target artifact rather than a native executable.
- The `compile` command must be described as compiling a source file from the language project.
- The initial CLI implementation may keep the compile action as a stub while the transpilation pipeline is still undefined.
- The CLI structure must be designed so future commands can be added without moving responsibility back into `src/main.ts`.

## Examples

- Expected source layout after implementation:
  - `src/main.ts`
  - `src/cli/`

- Expected command shape:

```text
f compile <input>
```

- Expected supported options:

```text
--target <target>
--tool <tool>
--output <output>
--transpile-only
```

- Expected behavior examples:

```text
f compile program.f
f compile program.f --target c --tool clang --output bin/program
f compile program.f --target c --output generated/program.c --transpile-only
```

## Acceptance Criteria

- A spec exists defining the initial CLI command structure for the project.
- The spec declares `cac` as the CLI library.
- The spec requires CLI code to live under `src/cli`.
- The spec requires `src/main.ts` to initialize and execute the CLI.
- The spec defines the `compile <input>` command and its supported options.
- The spec defines `target` and `output` as required command options.
- The spec defines `tool` as conditionally required based on `transpile-only`.
- The spec allows the first implementation to keep the compile action as a stub until the compilation pipeline is specified by later specs.

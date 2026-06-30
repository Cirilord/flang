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
- Jest with `ts-jest` for automated tests
- ESLint for linting
- Prettier for formatting
- Lefthook for pre-commit hooks
- VS Code workspace settings in `.vscode/settings.json`

The initial source layout is:

- `src/cli/`
- `src/`
- `examples/`

The current lexer structure lives under `src/lexer/` and is split across token definitions, keyword lookup, lexer errors, and the lexer implementation.

The current parser foundation lives under `src/parser/` and is split across AST types, parser errors, and the parser implementation.

Available scripts:

- `yarn build`
- `yarn start`
- `yarn start:dev`
- `yarn test`
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

The current CLI already reads the input `.f` file, runs lexical analysis, and then builds the first parser AST for the source.

The command still stops after parsing for now, and it prints the generated tokens and AST for inspection. Transpilation and native compilation will be added by later specs.

Current examples:

```text
f compile program.f --target c --tool clang --output bin/program
f compile program.f --target c --output generated/program.c --transpile-only
```

Repository variable example source:

```text
examples/variables.f
```

Repository variable example test:

```text
examples/variables.spec.ts
```

Repository function example source:

```text
examples/functions.f
```

Repository function example test:

```text
examples/functions.spec.ts
```

Current function example source:

```text
fn pickValue(let value: i32, const fallback: i32): i32 {
  return value;
}

fn logValue(let value: i32): void {
  return;
}

fn main(): void {
  const result: i32 = pickValue(1, 2);
  return;
}
```

The current parser supports function declarations, parameter mutability, explicit return types, `return` statements, simple function calls, and explicit variable type annotations inside function bodies.

Current variable example source:

```text
fn main(): void {
  const positive: i32 = 1;
  const zero: u32 = 0;
  let decimal: f64 = 3.14;
  return;
}
```

## Documentation

- `docs/language.md` for the general language overview
- `docs/variables.md` for variable declarations and type annotation rules
- `docs/improvements.md` for planned language improvements

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

## Tests

Run the current automated tests with:

```text
yarn test
```

The current example test suites validate the lexer and parser behavior against `examples/functions.f` and `examples/variables.f`.

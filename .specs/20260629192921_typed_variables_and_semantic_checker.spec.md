# Typed Variable Annotations Spec

## Objective

Define the first explicit variable type annotation syntax for `flang` and extend the current lexer, parser, AST, examples, and CLI output to preserve typed variable declarations with numeric literals.

## Scope

In scope:

- Extending the lexer to recognize the `:` token required by typed variable declarations
- Extending the parser to require explicit type annotations in variable declarations
- Defining the first AST node shape for declared variable types
- Defining the first canonical numeric type names for `flang`
- Defining the initial subset of numeric types implemented in this stage
- Updating the current example and tests to use explicit numeric types
- Defining the parser and CLI behavior for explicitly typed numeric declarations

Out of scope:

- Semantic analysis
- Type inference
- Implicit variable types
- Type aliases such as `int`, `uint`, `float`, or `double`
- String, boolean, or user-defined types
- Function parameters and return types
- Expressions beyond the current numeric literal initializers
- Code generation
- Native compilation

## Design

- Variable declarations must require explicit type annotations.
- The first supported typed declaration syntax must be:
  - `const name: i32 = 1;`
  - `const name: u32 = 0;`
  - `let name: f64 = 3.14;`
- The lexer must recognize `:` as a dedicated token kind.
- The parser must reject variable declarations that omit the type annotation.
- The parser foundation must be extended so `VariableDeclarationNode` preserves the declared type.
- The AST must introduce a dedicated node for declared types.
- The first declared type node must represent named types and preserve the source type name lexeme.
- The parser implementation must be organized so future types can be added without reshaping the existing variable declaration contract.
- The implemented numeric type subset for this stage must live in a dedicated parser file rather than being declared inline inside the main parser implementation.
- The canonical numeric type names for `flang` must be:
  - `i8`
  - `u8`
  - `i16`
  - `u16`
  - `i32`
  - `u32`
  - `i64`
  - `u64`
  - `i128`
  - `u128`
  - `isize`
  - `usize`
  - `f16`
  - `f32`
  - `f64`
  - `f80`
  - `f128`
- This stage must implement parser-level support for this subset:
  - `i8`
  - `u8`
  - `i16`
  - `u16`
  - `i32`
  - `u32`
  - `i64`
  - `u64`
  - `i128`
  - `u128`
  - `f16`
  - `f32`
  - `f64`
  - `f80`
  - `f128`
- `isize` and `usize` must be registered by this spec as planned canonical numeric types, but their implementation must be deferred to a later spec.
- Type aliases must not be implemented in this stage.
- Later specs may add aliases such as:
  - `int`
  - `uint`
  - `float`
  - `double`
- The first typed variable stage must stop after parsing.
- The `f compile <input>` command must continue to run the parser after successful lexical analysis.
- While the compile flow stops before semantic analysis and code generation, the command must print the generated AST to the terminal for inspection.
- The current example file must be updated to:

```text
const positive: i32 = 1;
const zero: u32 = 0;
let decimal: f64 = 3.14;
```

- The first typed variable stage must remain explicit-first:
  - the source of truth is the declared type in the program
  - later stages may classify numeric literals more precisely, but this stage must already preserve the declared type in the AST
- Unsupported canonical numeric types outside the implemented subset must remain reserved for later implementation rather than being introduced through aliases.

## Examples

- Expected compile flow for the current stage:
  - read the `.f` input file
  - tokenize the source with `Lexer`
  - parse the token list with `Parser`
  - print the generated tokens
  - print the generated AST
  - stop after the parser stage

- Example source:

```text
const positive: i32 = 1;
const zero: u32 = 0;
let decimal: f64 = 3.14;
```

- Example AST shape:

```text
ProgramNode
  VariableDeclarationNode(mutability="const", name="positive", declaredType=NamedTypeNode("i32"), initializer=NumberLiteralNode("1"))
  VariableDeclarationNode(mutability="const", name="zero", declaredType=NamedTypeNode("u32"), initializer=NumberLiteralNode("0"))
  VariableDeclarationNode(mutability="let", name="decimal", declaredType=NamedTypeNode("f64"), initializer=NumberLiteralNode("3.14"))
```

- Example invalid source:

```text
const value = 1;
```

- Expected behavior for missing types:
  - the parser reports an error because the variable declaration is missing `: <type>`

- Example deferred type source:

```text
const size: usize = 1;
```

- Expected behavior for deferred types in this stage:
  - `usize` remains a declared canonical type in the language design
  - implementation support for `usize` is deferred to a later spec

- Example alias source:

```text
const value: int = 1;
```

- Expected behavior for aliases in this stage:
  - aliases are not part of the implemented syntax in this stage
  - alias support is deferred to a later spec

## Acceptance Criteria

- A spec exists defining the first explicit variable type annotation syntax for the project.
- The spec requires typed variable declarations to include `: <type>` before `=`.
- The spec requires the lexer to recognize the `:` token.
- The spec requires the parser to preserve the declared variable type in the AST.
- The spec defines the canonical numeric type names for the language.
- The spec defines the implemented numeric type subset for this stage.
- The spec requires the implemented numeric type subset to be stored in a dedicated parser file.
- The spec records `isize` and `usize` as planned canonical types while deferring their implementation.
- The spec explicitly defers type aliases such as `int`, `uint`, `float`, and `double`.
- The spec requires the current example and tests to use explicitly typed numeric declarations.
- The spec requires the current `compile` command flow to stop after parsing and print the typed AST.

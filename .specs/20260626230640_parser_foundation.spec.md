# Parser Foundation Spec

## Objective

Define the first parser layer for the `flang` language, including the initial parser file structure, the minimal AST shape, and support for parsing the current `examples/variables.f` source.

## Scope

In scope:

- Defining the initial parser file structure under `src/parser`
- Defining the first parser-specific error type
- Defining the initial AST node shapes required by the current lexer example
- Defining the parser input and output contract
- Defining support for parsing variable declarations from the current `examples/variables.f` file
- Defining the first integration of the parser with the `f compile <input>` command

Out of scope:

- Function declarations
- Control flow statements
- Binary expressions
- Type annotations
- Code generation
- Full language grammar beyond the current variables example

## Design

- The parser structure should follow the same general architectural direction as the parser in `/Users/cirilo/Desktop/pulse/src/parser`, while staying limited to the current `flang` MVP scope.
- The parser implementation must be organized with these files:
  - `src/parser/ast/base-node.ts`
  - `src/parser/ast/identifier-node.ts`
  - `src/parser/ast/index.ts`
  - `src/parser/ast/number-literal-node.ts`
  - `src/parser/ast/program-node.ts`
  - `src/parser/ast/variable-declaration-node.ts`
  - `src/parser/errors.ts`
  - `src/parser/index.ts`
- `src/parser/errors.ts` must define parser-specific error types.
- `src/parser/errors.ts` should export a `ParserError` type or class that includes token location information.
- `src/parser/ast/` must define the first AST node types returned by the parser, with one main node type per file and `src/parser/ast/index.ts` re-exporting the public AST types.
- `src/parser/index.ts` must contain the parser implementation.
- `src/parser/index.ts` should export a `Parser` class responsible for building the AST.
- The `Parser` class should receive `Token[]` through its constructor.
- The parser input must be the ordered token list produced by the lexer.
- The parser output must be a `ProgramNode`.
- The parser must expose a `parseProgram()` method that returns the root `ProgramNode`.
- All AST nodes must include:
  - `kind`
  - `location`
- AST node locations must use the same inclusive `start` and exclusive `end` contract already defined for lexer token locations.
- The initial AST must include these node kinds:
  - `ProgramNode`
  - `VariableDeclarationNode`
  - `IdentifierNode`
  - `NumberLiteralNode`
- `ProgramNode` must contain an ordered `body` array.
- `VariableDeclarationNode` must represent both `const` and `let` declarations.
- `VariableDeclarationNode` must preserve the declaration mutability in the AST.
- `VariableDeclarationNode` must contain:
  - `name`
  - `initializer`
  - `mutability`
  - `kind`
  - `location`
- `name` must be an `IdentifierNode`.
- `initializer` must support:
  - `NumberLiteralNode`
- `IdentifierNode` must contain the identifier name.
- `NumberLiteralNode` must preserve the original numeric lexeme from the source.
- The first parser version must support these forms:
  - `const name = 1;`
  - `const name = 0;`
  - `let name = 3.14;`
- The `f compile <input>` command must run the parser after successful lexical analysis.
- While the compile flow stops before transpilation, the command must print the generated AST to the terminal for inspection.
- The parser must consume the EOF token and stop after the end of the program.
- When the parser finds an unexpected token, it must report a parser error with location information.
- The parser foundation must be designed so new statement and expression node kinds can be added without reshaping the existing node location contract.

## Examples

- Expected implementation files:
  - `src/parser/ast/base-node.ts`
  - `src/parser/ast/identifier-node.ts`
  - `src/parser/ast/index.ts`
  - `src/parser/ast/number-literal-node.ts`
  - `src/parser/ast/program-node.ts`
  - `src/parser/ast/variable-declaration-node.ts`
  - `src/parser/errors.ts`
  - `src/parser/index.ts`

- Expected parser public surface:
  - `Parser`
  - `ParserError`
  - `ProgramNode`

- Expected compile flow for the current stage:
  - read the `.f` input file
  - tokenize the source with `Lexer`
  - parse the token list with `Parser`
  - print the generated tokens
  - print the generated AST
  - stop after the parser stage

- Example source:

```text
const positive = 1;
const zero = 0;
let decimal = 3.14;
```

- Example AST shape:

```text
ProgramNode
  VariableDeclarationNode(mutability="const", name="positive", initializer=NumberLiteralNode("1"))
  VariableDeclarationNode(mutability="const", name="zero", initializer=NumberLiteralNode("0"))
  VariableDeclarationNode(mutability="let", name="decimal", initializer=NumberLiteralNode("3.14"))
```

- Example invalid token sequence:

```text
const = 1;
```

- Expected behavior for invalid syntax:
  - the parser reports a parser error
  - the error includes token location information

## Acceptance Criteria

- A spec exists defining the first parser foundation for the project.
- The spec defines the required parser files under `src/parser`.
- The spec defines the parser input as lexer tokens and the output as a `ProgramNode` AST node.
- The spec defines the first AST node kinds required by the variables example.
- The spec defines support for parsing `const` and `let` variable declarations with numeric initializers.
- The spec requires the current `compile` command flow to invoke the parser after lexing and print the generated AST.
- The spec defines parser error reporting with location information.

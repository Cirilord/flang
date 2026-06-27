# Lexer Foundation Spec

## Objective

Define the first lexical analysis layer for the `flang` language, including token types, token shape, keyword recognition, and the initial lexer file structure.

## Scope

In scope:

- Defining the initial lexer file structure under `src/lexer`
- Defining the purpose of `keywords.ts`, `index.ts`, `token-type.ts`, and `token.ts`
- Defining the first token categories supported by the lexer
- Defining the input and output contract of the lexer
- Defining the minimum lexical error behavior
- Defining the first integration of the lexer with the `f compile <input>` command
- Defining the first example source file under `examples/`

Out of scope:

- Parsing or AST generation
- Semantic analysis
- Code generation
- Full language grammar design
- Comments, floats, strings, and advanced token kinds beyond the first lexer MVP

## Design

- The lexer implementation must be organized with these files:
  - `src/lexer/errors.ts`
  - `src/lexer/keywords.ts`
  - `src/lexer/index.ts`
  - `src/lexer/token-type.ts`
  - `src/lexer/token.ts`
- `src/lexer/errors.ts` must define lexer-specific error types.
- `src/lexer/token-type.ts` must define the token kind enum used by the lexer.
- `src/lexer/token.ts` must define the token structure returned by the lexer.
- `src/lexer/keywords.ts` must define the keyword lookup used to distinguish identifiers from reserved words.
- `src/lexer/index.ts` must contain the lexer implementation.
- The lexer input must be a string containing the contents of a `.f` source file.
- The lexer output must be an ordered list of tokens.
- The lexer output must always end with an EOF token.
- `src/lexer/token.ts` must define:
  - `TokenPosition`
  - `TokenLocation`
  - `Token`
- Each token must include:
  - `type`
  - `lexeme`
  - `location`
- The token shape must follow this contract:

```ts
{
  lexeme: string;
  location: {
    end: {
      column: number;
      line: number;
    };
    start: {
      column: number;
      line: number;
    };
  };
  type: TokenType;
}
```

- `TokenPosition` must include:
  - `line`
  - `column`
- `TokenLocation` must include:
  - `start`
  - `end`
- `location.start` must be inclusive.
- `location.end` must be exclusive.
- The lexer must ignore spaces, tabs, and carriage returns.
- The lexer must track line and column positions.
- The lexer must support newline tracking even if newline is not emitted as a token.
- `src/lexer/keywords.ts` should expose the keyword lookup as a `ReadonlyMap<string, TokenType>`.
- `src/lexer/index.ts` should export a `Lexer` class responsible for tokenization.
- The `Lexer` class should receive the source text through its constructor.
- The `Lexer` class should expose a `tokenize()` method that returns `Token[]`.
- `src/lexer/errors.ts` should export a `LexerError` type or class that includes lexical position information.
- The `f compile <input>` command must read the input source file and run the lexer before any later transpilation or native compilation stage.
- The first `compile` integration may stop after lexical analysis and does not need to perform parsing, transpilation, or native compilation yet.
- While the compile flow stops at lexical analysis, the command must print the generated tokens to the terminal for inspection.
- The repository must include `examples/variables.f` as the first example source file for the lexer MVP.
- `examples/variables.f` must contain the same source used by this spec examples, covering a positive number, zero, and a decimal number.
- The lexer must recognize identifiers.
- The lexer must recognize keywords through `src/lexer/keywords.ts`.
- The first lexer version must recognize these keywords:
  - `let`
  - `const`
- The lexer must recognize number literals through a single `NumberLiteral` token kind.
- The lexer must recognize positive integer literals.
- The lexer must recognize zero as a number literal.
- The lexer must recognize simple decimal literals with digits on both sides of the dot.
- The lexer must recognize these punctuation tokens:
  - `;`
- The lexer must recognize these operator tokens:
  - `=`
- The lexer must distinguish keywords from identifiers by matching the full lexeme.
- When the lexer finds an unsupported or invalid character, it must report a lexical error with position information.
- The EOF token must use the current lexer position as both the start and end location.
- The lexer foundation must be designed so new token kinds can be added without changing the token shape contract.

## Examples

- Expected implementation files:
  - `src/lexer/errors.ts`
  - `src/lexer/keywords.ts`
  - `src/lexer/index.ts`
  - `src/lexer/token-type.ts`
  - `src/lexer/token.ts`

- Expected lexer public surface:
  - `Lexer`
  - `LexerError`
  - `Token`
  - `TokenType`

- Expected compile flow for the current stage:
  - read the `.f` input file
  - tokenize the source with `Lexer`
  - print the generated tokens
  - stop after the lexical stage

- Expected example source file:
  - `examples/variables.f`

- Example source:

```text
const positive = 1;
const zero = 0;
let decimal = 3.14;
```

- Example token sequence shape:

```text
CONST
IDENTIFIER("positive")
EQUAL
NUMBER("1")
SEMICOLON
CONST
IDENTIFIER("zero")
EQUAL
NUMBER("0")
SEMICOLON
LET
IDENTIFIER("decimal")
EQUAL
NUMBER("3.14")
SEMICOLON
EOF
```

- Example invalid input:

```text
let value = @;
```

- Expected behavior for invalid input:
  - the lexer reports a lexical error for `@`
  - the error includes line and column information

## Acceptance Criteria

- A spec exists defining the first lexer foundation for the project.
- The spec defines the required lexer files under `src/lexer`.
- The spec defines the token output contract, including `type`, `lexeme`, and `location`.
- The spec defines the first supported keyword, number literal, semicolon, and equals token groups.
- The spec requires an EOF token in the lexer output.
- The spec defines positional lexical error reporting for invalid characters.
- The spec requires the current `compile` command flow to invoke the lexer on the input file.
- The spec requires the current `compile` command flow to print the generated tokens.
- The spec requires `examples/variables.f` with the lexer MVP source example.

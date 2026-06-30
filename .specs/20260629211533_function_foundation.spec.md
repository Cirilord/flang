# Function Foundation Spec

## Objective

Define the first function syntax for `flang`, including function declarations, function parameters, explicit return types, `return` statements, and simple function calls, so the language can evolve toward function-based programs before code generation resumes.

## Scope

In scope:

- Defining the first function declaration syntax
- Defining the first function parameter syntax
- Defining explicit function return type annotations
- Defining the first `return` statement forms
- Defining the first function call syntax
- Defining the first AST node shapes required for functions
- Defining the first lexer and parser support needed for function declarations
- Defining `examples/functions.f` and `examples/functions.spec.ts` as the first dedicated function example files
- Preserving `examples/variables.f` as a separate variable-oriented example file

Out of scope:

- Semantic analysis
- Name resolution
- Code generation
- Native compilation
- Closures
- Methods
- Modules
- Control flow beyond `return`
- Binary expressions

## Design

- The language direction for functions must follow this syntax style:

```text
fn pickValue(let value: i32, const fallback: i32): i32 {
  return value;
}

fn logValue(let value: i32): void {
  return;
}
```

- Function declarations must start with the `fn` keyword.
- Every function declaration must include:
  - a function name
  - a parameter list
  - an explicit return type annotation
  - a block body
- Parameters must preserve mutability in the function signature by using `let` or `const`.
- Parameter declarations must follow the same explicit type annotation shape already used by variables:
  - `let name: type`
  - `const name: type`
- Function return types must use the `: type` syntax after the parameter list.
- The first function body syntax must be block-based and use `{` and `}`.
- The lexer must recognize the additional tokens required for this stage:
  - `fn`
  - `return`
  - `(`
  - `)`
  - `{`
  - `}`
  - `,`
- The parser foundation must be extended so `ProgramNode.body` can contain function declarations.
- The first function stage must introduce function declarations as the top-level program structure for the dedicated function example source used by this spec.
- The first function stage does not need to preserve the previous top-level variable-only example shape inside the dedicated function example files.
- The first dedicated function example files for this stage must be:
  - `examples/functions.f`
  - `examples/functions.spec.ts`
- `examples/variables.f` may remain in the repository as a separate example focused on variable declaration syntax.
- `examples/variables.f` may wrap its variable declarations inside `fn main(): void` so it remains compatible with the current function-based program structure while still focusing on variable declaration syntax.
- This stage supersedes the earlier top-level variable-only example shape for the current `examples/variables.f` workspace file.
- The earlier specs that described `examples/variables.f` as top-level declarations remain valid as historical records of those earlier stages and must not be rewritten.
- The AST must introduce dedicated node types for:
  - function declarations
  - function parameters
  - return statements
  - block statements
- The AST should introduce the minimum expression nodes needed by the function examples in this spec.
- The first expression support required by this spec is:
  - identifier references
  - function calls
- The first function call support required by this spec is:
  - calls by identifier
  - zero or more positional arguments
  - arguments parsed as expressions
- The first return statement support required by this spec is:
  - `return expression;`
  - `return;`
- The function foundation must support functions with zero or more parameters.
- The first parser version for this stage must support these forms:
  - `fn name(): void { return; }`
  - `fn name(let value: i32): void { return; }`
  - `fn pickValue(let value: i32, const fallback: i32): i32 { return value; }`
  - `fn main(): void { const result: i32 = pickValue(1, 2); return; }`
- The parser implementation must be organized so later specs can add:
  - more expressions
  - more statements inside blocks
  - checker and code generation support
- The current variable declaration syntax inside function bodies should remain aligned with the existing explicit annotation style.
- This stage should reuse the current canonical numeric type direction for parameter types, local variable declarations, and non-void function return types.
- This stage introduces `void` as the return type name for functions that do not return a value.
- The compile flow should continue to stop after parsing at this stage, while printing the generated tokens and AST for inspection.

## Examples

- Example function declaration with an expression return:

```text
fn pickValue(let value: i32, const fallback: i32): i32 {
  return value;
}
```

- Example function declaration with `void` return:

```text
fn logValue(let value: i32): void {
  return;
}
```

- Example function call:

```text
fn main(): void {
  const result: i32 = pickValue(1, 2);
  return;
}
```

- Example AST shape direction:

```text
ProgramNode
  FunctionDeclarationNode(name="pickValue", returnType=NamedTypeNode("i32"))
    FunctionParameterNode(mutability="let", name="value", declaredType=NamedTypeNode("i32"))
    FunctionParameterNode(mutability="const", name="fallback", declaredType=NamedTypeNode("i32"))
    BlockStatementNode
      ReturnStatementNode(IdentifierReferenceNode("value"))
  FunctionDeclarationNode(name="main", returnType=NamedTypeNode("void"))
    BlockStatementNode
      VariableDeclarationNode(mutability="const", name="result", declaredType=NamedTypeNode("i32"), initializer=CallExpressionNode(callee=IdentifierReferenceNode("pickValue"), arguments=[NumberLiteralNode("1"), NumberLiteralNode("2")]))
      ReturnStatementNode()
```

- Example invalid source:

```text
fn pickValue(let value: i32, const fallback: i32) {
  return value;
}
```

- Expected behavior for invalid function syntax:
  - the parser reports an error because the function is missing an explicit return type

## Acceptance Criteria

- A spec exists defining the first function foundation for the project.
- The spec defines the `fn`-based function declaration syntax direction.
- The spec defines function parameters with `let` and `const` mutability markers.
- The spec defines explicit return type annotations for functions.
- The spec aligns function parameter types and non-void return types with the current canonical numeric type policy.
- The spec introduces `void` as the return type name for functions without a return value.
- The spec defines the first `return` statement forms.
- The spec defines the first function call syntax.
- The spec defines the lexer token additions required for functions.
- The spec defines the minimum AST additions required for function declarations, function parameters, block statements, return statements, function calls, and the simplest expressions.
- The spec defines function declarations as the top-level program structure for the first function-stage example sources.
- The spec defines `examples/functions.f` and `examples/functions.spec.ts` as the first dedicated function example files.
- The spec preserves `examples/variables.f` as a separate variable-oriented example file.
- The spec requires the compile flow to continue stopping after parsing while printing tokens and AST.

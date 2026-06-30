# Variables

`flang` currently supports variable declarations with explicit type annotations.

## Declaration Forms

Immutable variables use `const`:

```text
const positive: i32 = 1;
```

Mutable variables use `let`:

```text
let decimal: f64 = 3.14;
```

## Rules

- every variable declaration must include an explicit type annotation
- the type annotation appears between the variable name and the initializer
- the initializer must currently be a numeric literal

The current declaration shape is:

```text
const name: type = value;
let name: type = value;
```

## Current Example

```text
fn main(): void {
  const positive: i32 = 1;
  const zero: u32 = 0;
  let decimal: f64 = 3.14;
  return;
}
```

## Numeric Types

The current parser implementation supports these numeric type names:

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

Aliases such as `int`, `uint`, `float`, and `double` are not implemented in the current stage.

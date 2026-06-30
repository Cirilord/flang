# Improvements

This document tracks planned language improvements that are not implemented yet.

## Planned Numeric Type Work

- implement `isize`
- implement `usize`

These types are already part of the planned canonical numeric type direction, but support is deferred to a later spec.

## Planned Analysis Work

- add a semantic checker stage after parsing
- validate declared types separately from parsing
- expand numeric type handling beyond the current parser-level validation

## Planned Code Generation Work

- resume the C code generation work from the stashed implementation
- generate `.c` output from the parsed AST
- integrate transpilation output with the `compile` command

# Jest Examples Setup Spec

## Objective

Define the first automated test setup for the `flang` project using Jest, with test files colocated in `examples/` beside their corresponding `.f` source files.

## Scope

In scope:

- Reintroducing Jest into the project tooling
- Defining the initial Jest configuration file
- Defining the required package script and development dependencies for running tests
- Defining the first example test file as `examples/variables.spec.ts`
- Defining the relationship between `examples/variables.spec.ts` and `examples/variables.f`

Out of scope:

- Adding parser or transpiler tests
- Snapshot testing
- Browser or integration test environments
- Multiple test runners
- Large test suites beyond the first lexer-focused example

## Design

- The project must include a root `jest.config.js` file.
- `jest.config.js` must use this configuration shape:

```js
/** @type {import('jest').Config} */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/examples'],
  testEnvironment: 'node',
  watchman: false,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
```

- The project must include the dev dependencies required by this Jest setup:
  - `jest`
  - `ts-jest`
  - `@types/jest`
- `package.json` must include this `test` script:

```json
"test": "NODE_OPTIONS=--experimental-vm-modules jest --watchman=false"
```

- `tsconfig.json` must include the Jest types required by the test files.
- `lefthook.yml` must run tests in the `pre-commit` hook.
- The first automated test file must be `examples/variables.spec.ts`.
- `examples/variables.spec.ts` must live beside `examples/variables.f`.
- The first test file must validate the lexer behavior for the current `variables.f` example.
- The first test file should cover the token sequence produced from `examples/variables.f`.
- The first test file should validate the current number cases already defined by the lexer foundation spec:
  - positive number
  - zero
  - decimal number
- The first test file may read `examples/variables.f` from disk instead of inlining the source, so the example file remains the source of truth for that fixture.
- The README must be updated to document the availability of Jest tests and how to run them.

## Examples

- Expected new or updated files:
  - `jest.config.js`
  - `lefthook.yml`
  - `package.json`
  - `tsconfig.json`
  - `examples/variables.spec.ts`
  - `README.md`

- Expected Jest command:

```text
yarn test
```

- Expected example test target:

```text
examples/variables.f
```

- Expected first test focus:

```text
The lexer tokenizes the variables example source into the expected token sequence.
```

## Acceptance Criteria

- A spec exists defining the first Jest setup for the project.
- The spec defines `jest.config.js` with the provided ESM and `ts-jest` configuration.
- The spec requires Jest-related dev dependencies and the explicit `test` script in `package.json`.
- The spec requires Jest types in `tsconfig.json`.
- The spec requires the `pre-commit` hook to run tests through `lefthook.yml`.
- The spec requires `examples/variables.spec.ts` beside `examples/variables.f`.
- The spec requires the first automated test to validate lexer behavior for the variables example.
- The spec requires README documentation for running tests.

# TypeScript Tooling Bootstrap Spec

## Objective

Define the initial Node.js and TypeScript tooling for the `flang` transpiler project, including package management, development scripts, formatting, linting, type-checking, and git hooks.

## Scope

In scope:

- Creation of `package.json` for the TypeScript-based transpiler project
- Definition of the required `scripts`
- Definition of the required `devDependencies`
- Creation of Prettier, ESLint, TypeScript, and Lefthook configuration files
- Creation of `.gitignore` for generated and dependency directories
- Creation of `.vscode/settings.json` for editor integration
- Establishing the expected source directory targets referenced by the tooling

Out of scope:

- Installing dependencies
- Implementing the transpiler source code
- Creating runtime application logic
- Defining the language syntax or compiler pipeline

## Design

- The transpiler implementation language must be TypeScript.
- The project package manifest must be created as `package.json`.
- The `package.json` file must contain exactly these top-level fields and values:

```json
{
  "name": "flang",
  "version": "0.0.0",
  "private": true,
  "packageManager": "yarn@1.22.22",
  "type": "module"
}
```

- The `package.json` file must define these scripts:

```json
{
  "build": "tsc -p tsconfig.json",
  "start": "node dist/src/main.js",
  "start:dev": "tsx src/main.ts",
  "prepare": "lefthook install || true",
  "format": "prettier \"src/**/*.ts\" --write",
  "lint": "eslint \"src/**/*.ts\" --fix",
  "type-check": "tsc --noEmit -p tsconfig.json"
}
```

- The `package.json` file must define these `devDependencies`:

```json
{
  "@eslint/js": "^9.29.0",
  "@tsconfig/strictest": "^2.0.8",
  "@types/node": "^24.0.4",
  "eslint": "^9.29.0",
  "eslint-config-prettier": "^10.1.5",
  "eslint-plugin-import": "^2.31.0",
  "eslint-plugin-prettier": "^5.5.0",
  "lefthook": "^2.1.9",
  "prettier": "^3.5.3",
  "tsx": "^4.20.1",
  "typescript": "^5.8.3",
  "typescript-eslint": "^8.34.0"
}
```

- The Prettier configuration file must be created with these settings:

```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "printWidth": 120,
  "quoteProps": "consistent",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

- The ESLint configuration must be implemented as an ESM module and must export this configuration:

```ts
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            order: 'alphabetically',
          },
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'object'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-console': 'off',
    },
  }
);
```

- The TypeScript configuration must be created with this content:

```json
{
  "extends": "@tsconfig/strictest/tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "rootDir": ".",
    "outDir": "dist",
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

- The repository must include a `.gitignore` file with this content:

```text
dist/
node_modules/
```

- The Lefthook configuration must be created with this content:

```yml
pre-commit:
  commands:
    format:
      glob: '**/*.{js,jsx,ts,tsx,json}'
      env:
        DOTENV_CONFIG_PATH: .env
      run: ./node_modules/.bin/prettier --write {staged_files}
      stage_fixed: true
    lint:
      glob: 'src/**/*.{js,jsx,ts,tsx}'
      env:
        DOTENV_CONFIG_PATH: .env
      run: ./node_modules/.bin/eslint --fix {staged_files}
      stage_fixed: true
    type-check:
      glob: 'src/**/*.{ts,tsx}'
      env:
        DOTENV_CONFIG_PATH: .env
      run: ./node_modules/.bin/tsc --noEmit -p tsconfig.json
```

- The resulting tooling layout must support these directories:
  - `src/`
- No additional source or tooling directories are part of this bootstrap scope.
- The bootstrap implementation must include a minimal `src/main.ts` entrypoint so the TypeScript project has an initial source file compatible with the declared scripts and include paths.
- The repository editor settings must include a `.vscode/settings.json` file with this content:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.prettier": "explicit"
  }
}
```
- The TypeScript include paths must cover `src/**/*.ts`.
- The project must remain compatible with the spec-driven workflow already defined in `AGENTS.md` and `README.md`.

## Examples

- Expected manifest and config files to be created during implementation:
  - `package.json`
  - `tsconfig.json`
  - `eslint.config.js` or another ESM ESLint config filename
  - Prettier configuration file containing the declared settings
  - `.gitignore`
  - `lefthook.yml`
  - `.vscode/settings.json`
  - `src/main.ts`

- Expected commands after implementation:
  - `yarn build`
  - `yarn start`
  - `yarn start:dev`
  - `yarn format`
  - `yarn lint`
  - `yarn type-check`

## Acceptance Criteria

- A spec exists defining the TypeScript tooling bootstrap for the transpiler project.
- The spec declares TypeScript as the implementation language for the transpiler.
- The spec defines the exact `package.json` fields, scripts, and `devDependencies` requested.
- The spec defines the exact Prettier, ESLint, TypeScript, and Lefthook configurations requested.
- The spec defines the exact `.gitignore` content requested.
- The spec defines the exact `.vscode/settings.json` content requested.
- The spec documents the expected directory targets used by the tooling.
- The implemented tooling files match the approved spec.

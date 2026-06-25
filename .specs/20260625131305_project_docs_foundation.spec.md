# Project Docs Foundation Spec

## Objective

Define the initial documentation contract for the `flang` language repository by establishing the purpose and maintenance rules for `README.md` and `AGENTS.md`.

## Scope

In scope:

- Creation and maintenance expectations for `README.md`
- Creation and maintenance expectations for `AGENTS.md`
- The declaration of the standard spec shape inside `AGENTS.md`
- The rule that every implementation must begin with a spec stored in `.specs/`
- The refinement and approval flow required before implementation

Out of scope:

- Compiler or transpiler implementation details
- Language syntax or semantics
- Build tooling decisions

## Design

- The repository must contain a `README.md` file.
- The README must use `# flang` as the primary heading.
- The README must explain that `flang` is a programming language project.
- The README must state that the project follows a spec-driven workflow.
- The README must describe the spec-driven workflow at a high level.
- The README must mention that source files use the `.f` extension.
- The README must explain that the implementation strategy is to transpile `flang` code into C and then compile the generated C with a standard compiler such as `clang` or `gcc`.
- The README must document the implementation order as:
  1. Create the relevant spec.
  2. Refine the spec until the design is aligned.
  3. Approve the spec.
  4. Implement the change.

- The repository must contain an `AGENTS.md` file.
- `AGENTS.md` must instruct contributors to write code, comments, documentation, filenames, and commit-facing text in English.
- `AGENTS.md` must instruct contributors to make only explicitly requested changes.
- `AGENTS.md` must instruct contributors to answer questions without changing files unless implementation is explicitly requested.
- `AGENTS.md` must explicitly require a spec before every implementation.
- `AGENTS.md` must require the spec to be refined and approved before implementation starts.
- `AGENTS.md` must define the spec filename format as `YYYYMMDDHHMMSS_name_of_the_spec`.
- `AGENTS.md` must require `README.md` updates whenever project behavior, setup, scripts, or usage changes.
- `AGENTS.md` must require design alignment before significant structural language or compiler changes.
- `AGENTS.md` must keep feature discussions in design mode until implementation is explicitly requested.
- `AGENTS.md` must define commit messages in the `type(scope): message` format and allow a short bullet list in the commit body.
- `AGENTS.md` must declare the standard spec shape used by the repository.
- `AGENTS.md` must define the spec shape without requiring `Metadata` or `Status` sections.
- Specs must be treated as the source of truth for implementation.
- Code and project files must be updated to match the approved spec when drift exists.
- Specs must not be rewritten just to match an implementation that diverged from them without prior approval.

## Acceptance Criteria

- A `.specs/` directory exists in the repository.
- A spec exists describing the documentation foundation.
- The documented workflow states that specs are created first, refined next, and implemented only after approval.
- `README.md` contains an initial description of the project and workflow.
- `AGENTS.md` includes the spec-first rule and spec naming convention.

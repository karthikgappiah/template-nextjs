# Coding Agent Instructions

`CLAUDE.md` is a symlink to this file — edit `AGENTS.md`, never replace the symlink.

## What this repo is

A starter template, not an application: the Biome.js code-quality setup (formatter, linter, import
assist) plus the pnpm and Git-hook wiring that enforces it, for generating downstream projects. No
source tree, build step, or tests yet — adding one means adding the matching scripts and CI steps.

## Commands

```sh
pnpm install     # also installs the lefthook Git hooks (allowBuilds in pnpm-workspace.yaml)
pnpm lint        # biome check --write — format + lint + organize imports, applying fixes
pnpm lint:ci     # biome ci . — check-only, non-zero exit on any diagnostic
pnpm biome check --write <paths>   # scope a check to specific paths
```

## Quality gates

Same Biome checks at three layers, so passing `pnpm lint` locally should pass everywhere:

- **pre-commit** (`lefthook.jsonc`) — `biome check --write` over staged files matching its `glob`,
  `stage_fixed: true` re-stages autofixes. Skipped during merge and rebase.
- **pre-push** — full `pnpm lint:ci`.
- **CI** (`.github/workflows/code-quality.yml`) — `pnpm lint:ci` on every push and pull request.

## Conventions

- **Tool config is JSONC** (`biome.jsonc`, `lefthook.jsonc`) — prefer it over YAML wherever a tool
  supports it, with `$schema` pinned to the installed tool version. Bumping `@biomejs/biome`
  (2.5.8) means updating the `biome.jsonc` `$schema` URL in the same change.
- **Versions come from the lockfile.** CI's `pnpm/setup` reads `devEngines.packageManager` in
  `package.json`; don't add `setup-node`/`setup-pnpm` steps duplicating a version string.
- **Biome respects `.gitignore`** (`vcs.useIgnoreFile`) and `files.ignoreUnknown` is `false` — an
  unrecognized file type is an error, not a silent skip. A new file kind may also need the
  pre-commit `glob` in `lefthook.jsonc` extended.
- Formatting: space indentation, double quotes in JS/TS, ESM (`"type": "module"`), Biome
  `recommended` lint rules.
- `.vscode/` pins Biome as the format-on-save formatter and disables Prettier/ESLint — keep editor
  behavior identical to `pnpm lint`.

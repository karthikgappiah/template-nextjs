# Coding Agent Instructions

`CLAUDE.md` is a symlink to this file — edit `AGENTS.md`, never replace the symlink.

## What this repo is

A starter template for generating downstream projects: a minimal Next.js App Router app in
TypeScript, plus the Biome.js code-quality setup (formatter, linter, import assist) and the pnpm
and Git-hook wiring that enforces it. There are no tests yet — adding them means adding the script,
the pre-push job, and the CI step together.

## Commands

```sh
pnpm install     # also installs the lefthook Git hooks (allowBuilds in pnpm-workspace.yaml)
pnpm dev         # next dev
pnpm build       # next build
pnpm start       # next start — serves the build output
pnpm lint        # biome check --write — format + lint + organize imports, applying fixes
pnpm lint:ci     # biome ci . — check-only, non-zero exit on any diagnostic
pnpm typecheck   # next typegen && tsc --noEmit
pnpm biome check --write <paths>   # scope a check to specific paths
```

## Source layout

- `src/app/` — App Router tree. `src/app/(pages)/` is a route group: it holds the root `layout.tsx`
  and the pages, without contributing a URL segment. New page trees go beside it as their own
  groups.
- **`@/*` maps to the repo root, not `src/`** (`tsconfig.json` `paths`, no `baseUrl`) — so the
  import is `@/src/lib/foo`, not `@/lib/foo`.
- `next-env.d.ts` and `.next/` are generated and `.gitignore`d; `pnpm typecheck` runs `next typegen`
  first so the generated route types in `.next/types/` exist before `tsc`.

## Quality gates

The same checks at four layers, so passing `pnpm lint` and `pnpm typecheck` locally should pass
everywhere:

- **on save** (`.vscode/settings.json`) — Biome format, safe fixes, organize imports.
- **pre-commit** (`lefthook.jsonc`) — `biome check --write` over staged files matching its `glob`,
  `stage_fixed: true` re-stages autofixes. Skipped during merge and rebase.
- **pre-push** — `pnpm lint:ci` and `pnpm typecheck`, in parallel.
- **CI** (`.github/workflows/code-quality.yml`) — the same two on every push and pull request.

Adding a gate means adding it in all the places it belongs, not just one.

## Conventions

- **Tool config is JSONC** (`biome.jsonc`, `lefthook.jsonc`) — prefer it over YAML wherever a tool
  supports it, with `$schema` pinned to the installed tool version. Bumping `@biomejs/biome`
  (2.5.8) means updating the `biome.jsonc` `$schema` URL in the same change.
- **Versions come from the lockfile.** CI's `pnpm/setup` reads `devEngines.packageManager` in
  `package.json`; don't add `setup-node`/`setup-pnpm` steps duplicating a version string.
- **Biome respects `.gitignore`** (`vcs.useIgnoreFile`) and `files.ignoreUnknown` is `false` — an
  unrecognized file type is an error, not a silent skip. A new file kind may also need the
  pre-commit `glob` in `lefthook.jsonc` extended.
- **Lint domains are on**: `project`, `react`, `next`, and `types` are all set to `recommended` in
  `biome.jsonc`. The `types` domain infers from type information, so lint output can shift when
  types change.
- TypeScript is `strict`. Don't loosen `tsconfig.json` to make a diagnostic go away.
- Formatting: space indentation, double quotes in JS/TS, ESM (`"type": "module"`), Biome
  `recommended` lint rules.
- `.vscode/` pins Biome as the format-on-save formatter and disables Prettier/ESLint — keep editor
  behavior identical to `pnpm lint`. It also sets `customLabels.patterns` so App Router tabs show
  their directory (`(pages)/about - page.tsx`); extend those patterns when adding a new App Router
  file convention.

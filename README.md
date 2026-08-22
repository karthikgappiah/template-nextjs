# Next.js Template

[![Code Quality Assurance](https://github.com/karthikgappiah/template-nextjs/actions/workflows/code-quality.yml/badge.svg)](https://github.com/karthikgappiah/template-nextjs/actions/workflows/code-quality.yml)

A GitHub template repository for Next.js projects: the App Router in TypeScript, with one
formatter, one linter, and one import organizer — [Biome](https://biomejs.dev) — wired so the
identical checks run in your editor, on commit, on push, and in CI. No Prettier/ESLint pairing, no
config drift, no "works on my machine" formatting diffs.

It boots to a "Hello, world!" page and nothing else. Generate a repo from it, then build your app
in `src/app/`.

## What you get

| File | Purpose |
| --- | --- |
| `src/app/` | App Router tree. `(pages)/` is a route group holding the root layout and pages. |
| `next.config.ts` | Empty, typed Next.js config — the place for your options. |
| `tsconfig.json` | `strict`, bundler resolution, and the `@/*` alias (see below). |
| `biome.jsonc` | Formatter, linter (`recommended` rules plus the React/Next/project/type domains), and import-organizing assist. Honors `.gitignore`; unknown file types error rather than pass silently. |
| `lefthook.jsonc` | Git hooks: `pre-commit` fixes staged files, `pre-push` lints and typechecks. |
| `.github/workflows/code-quality.yml` | Lints and typechecks on every push and pull request. |
| `.vscode/` | Biome as format-on-save formatter, Prettier and ESLint marked unwanted, and readable tab labels for App Router files. |
| `package.json` | The scripts below, plus the pnpm version CI installs. |
| `AGENTS.md` | The same conventions, written for coding agents (`CLAUDE.md` symlinks to it). |

## Quick start

1. Click **Use this template** on GitHub (or `gh repo create <name> --template karthikgappiah/template-nextjs`).
2. Clone it, install, and run it:

   ```sh
   pnpm install    # installs dependencies and the Git hooks
   pnpm dev        # http://localhost:3000
   ```

3. Make it yours: find and replace every `karthikgappiah/template-nextjs` with your own
   `owner/repo` — the CI badge above and the `gh repo create` line in step 1 both point back here
   until you do. Then set `name` and `license` in `package.json`, and rewrite this README's title
   and intro to describe your project.

That's it — hooks are active and the editor picks up `.vscode/` on open. Install the
[Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) when VS Code
prompts you.

**Requirements:** Node.js 24 and pnpm. pnpm's version is pinned in `package.json`
(`devEngines.packageManager`) and downloaded automatically if yours differs.

## Daily use

```sh
pnpm dev                           # dev server with hot reload
pnpm build                         # production build
pnpm start                         # serve the build output
pnpm lint                          # format, lint, and organize imports — writes fixes
pnpm lint:ci                       # check only; exits non-zero on any diagnostic
pnpm typecheck                     # generate route types, then tsc --noEmit
pnpm biome check --write src/      # scope a run to specific paths
```

In practice you rarely run the checks by hand: saving a file fixes it, and committing fixes
whatever you forgot.

## Writing pages

Routes live in `src/app/`. The `(pages)` directory is a route group — parentheses mean it shapes
the file tree without adding a URL segment — so `src/app/(pages)/page.tsx` serves `/` and
`src/app/(pages)/about/page.tsx` serves `/about`. The root `layout.tsx` lives in the group with
them.

One thing to know before your first import: **`@/*` maps to the repo root, not `src/`.** A helper at
`src/lib/format.ts` imports as `@/src/lib/format`. If you'd rather write `@/lib/format`, change
`paths` in `tsconfig.json` to `{ "@/*": ["./src/*"] }`.

## Quality gates

The same checks run at four points, so passing locally means passing everywhere.

| When | What runs | Notes |
| --- | --- | --- |
| On save | Format + safe fixes + organize imports | Via `.vscode/settings.json` |
| `git commit` | `biome check --write` on staged files | Fixes are re-staged into the commit. Skipped during merge and rebase. |
| `git push` | `pnpm lint:ci` and `pnpm typecheck` | Whole repo, in parallel |
| Push / PR | `pnpm lint:ci` and `pnpm typecheck` | GitHub Actions |

Need to bypass a hook once — a WIP commit, say? `LEFTHOOK=0 git commit …`. CI still has the final
word.

## Adapting it

- **Adding tests.** There's no test runner yet. Add the script, a `pre-push` job in
  `lefthook.jsonc`, and a CI step — all three, so the gates stay honest.
- **Adding a new file type.** Biome's `files.ignoreUnknown` is `false` on purpose: an unrecognized
  file is an error, not a silent skip. Either let Biome handle the type or add it to `.gitignore` —
  and extend the `glob` in `lefthook.jsonc` so the pre-commit hook sees it too.
- **Upgrading Biome.** Bump `@biomejs/biome` and update the `$schema` URL in `biome.jsonc` to the
  same version in the same commit; they are expected to match.
- **Changing style rules.** `biome.jsonc` is the single source of truth — space indentation, double
  quotes, ESM, and the `recommended` rules with the React, Next.js, project, and type domains
  enabled. Edit there and every gate follows.
- **Loosening TypeScript.** `strict` is on deliberately. Prefer fixing the type over editing
  `tsconfig.json`.

## Contributing

Branch from `main`, keep commits [Conventional
Commits](https://www.conventionalcommits.org)-style (`feat:`, `fix:`, `chore:`, `docs:`, `build:`),
and open a pull request. The hooks handle formatting; CI must be green to merge. Changes to
conventions belong in `AGENTS.md` as well as here.

## License

UNLICENSED — private template, all rights reserved.

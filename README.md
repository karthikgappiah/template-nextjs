# Biome.js — Code Quality Assurance

[![Code Quality Assurance](https://github.com/karthikgappiah/template-biomejs/actions/workflows/code-quality.yml/badge.svg)](https://github.com/karthikgappiah/template-biomejs/actions/workflows/code-quality.yml)

A GitHub template repository that gives a new project one formatter, one linter, and one import
organizer — [Biome](https://biomejs.dev) — wired so the identical checks run in your editor, on
commit, on push, and in CI. No Prettier/ESLint pairing, no config drift, no "works on my machine"
formatting diffs.

This is a starting point, not an application: there is no source tree, build step, or test suite.
Generate a repo from it, then add yours.

## What you get

| File | Purpose |
| --- | --- |
| `biome.jsonc` | Formatter, linter (`recommended` rules), and import-organizing assist. Honors `.gitignore`; unknown file types error rather than pass silently. |
| `lefthook.jsonc` | Git hooks: `pre-commit` fixes staged files, `pre-push` runs the full check. |
| `.github/workflows/code-quality.yml` | Runs the full check on every push and pull request. |
| `.vscode/` | Biome as format-on-save formatter; Prettier and ESLint marked unwanted. |
| `package.json` | The two scripts below, plus the pnpm version CI installs. |
| `AGENTS.md` | The same conventions, written for coding agents (`CLAUDE.md` symlinks to it). |

## Quick start

1. Click **Use this template** on GitHub (or `gh repo create <name> --template karthikgappiah/template-biomejs`).
2. Clone it and install:

   ```sh
   pnpm install    # installs dependencies and the Git hooks
   ```

3. Make it yours: find and replace every `karthikgappiah/template-biomejs` with your own
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
pnpm lint                          # format, lint, and organize imports — writes fixes
pnpm lint:ci                       # check only; exits non-zero on any diagnostic
pnpm biome check --write src/      # scope a run to specific paths
```

In practice you rarely run these by hand: saving a file fixes it, and committing fixes whatever you
forgot.

## Quality gates

The same Biome check runs at four points, so passing locally means passing everywhere.

| When | What runs | Notes |
| --- | --- | --- |
| On save | Format + safe fixes + organize imports | Via `.vscode/settings.json` |
| `git commit` | `biome check --write` on staged files | Fixes are re-staged into the commit. Skipped during merge and rebase. |
| `git push` | `pnpm lint:ci` on the whole repo | |
| Push / PR | `pnpm lint:ci` on the whole repo | GitHub Actions |

Need to bypass a hook once — a WIP commit, say? `LEFTHOOK=0 git commit …`. CI still has the final
word.

## Adapting it

- **Adding source code.** Drop it in; Biome picks it up. If you add a build or test step, add the
  script and a matching CI step so the gates stay honest.
- **Adding a new file type.** Biome's `files.ignoreUnknown` is `false` on purpose: an unrecognized
  file is an error, not a silent skip. Either let Biome handle the type or add it to `.gitignore` —
  and extend the `glob` in `lefthook.jsonc` so the pre-commit hook sees it too.
- **Upgrading Biome.** Bump `@biomejs/biome` and update the `$schema` URL in `biome.jsonc` to the
  same version in the same commit; they are expected to match.
- **Changing style rules.** `biome.jsonc` is the single source of truth — space indentation, double
  quotes, ESM. Edit there and every gate follows.

## Contributing

Branch from `main`, keep commits [Conventional
Commits](https://www.conventionalcommits.org)-style (`feat:`, `fix:`, `chore:`, `docs:`, `build:`),
and open a pull request. The hooks handle formatting; CI must be green to merge. Changes to
conventions belong in `AGENTS.md` as well as here.

## License

UNLICENSED — private template, all rights reserved.

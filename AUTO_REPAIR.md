# Self-Healing CI

The repository includes a guarded auto-repair controller in `.github/workflows/auto-repair.yml`.

## What it does

When the `CI` workflow fails on a branch owned by this repository, the controller:

1. Checks out the exact failed commit.
2. Reproduces dependency installation.
3. Runs the allow-listed deterministic repair script at `scripts/auto-repair.mjs`.
4. Regenerates the npm lockfile without lifecycle scripts.
5. Runs tests, NIST/PQC checks, the crypto audit, the universal reality gate, and the high-severity npm audit.
6. Applies a repair only after that complete verification succeeds.
7. Re-runs CI on the repaired revision.
8. Opens a GitHub issue instead of forcing a change when the safe repair set cannot make the repository green.

## Allowed automatic repairs

The controller may:

- convert caret/tilde ranges for the repository's cryptographic packages into exact pins;
- move `tsx` into runtime dependencies when operational npm scripts invoke it;
- migrate the known `@noble/hashes` v2 SHA-256 import path to `@noble/hashes/sha2.js`;
- replace the repository's hard-coded local Windows `tsx` executable path with `npx --no-install tsx`;
- generate or refresh `package-lock.json`.

It does **not** use `npm audit fix --force`, suppress tests, weaken audit thresholds, disable security checks, or make arbitrary AI-generated source edits.

## Loop and trust controls

- Only failures from this repository's own branches are eligible.
- Branches prefixed with `automation/auto-repair-` are not recursively repaired.
- A stale branch is never overwritten if it advanced after the failed run.
- Default-branch repairs are proposed through a repair PR rather than pushed directly.
- If the verified tree has no changes, the system treats the failure as transient and retries the failed jobs.

# Contributing to Republic of Divine Light

This repository is the RDL ecosystem/governance landing project. The canonical runnable blockchain implementation is `elon00/pq-rdl-blockchain`.

## Before opening a pull request

```bash
npm install --ignore-scripts
npm test
npm run test:nist
npm run audit:crypto
npm audit --audit-level=high
```

## Contribution rules

- Keep ecosystem/governance material consistent with the canonical implementation.
- Do not present internal tests as independent certification.
- Do not claim a public testnet/mainnet or production deployment without externally inspectable evidence.
- Never commit secrets, private keys, API tokens, or personal/operator data.
- Keep links, status tables, and evidence references current.
- Route implementation-level consensus/node changes to `pq-rdl-blockchain`.

Report vulnerabilities privately according to `SECURITY.md`.

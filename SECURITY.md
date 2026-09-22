# Security Policy

## Supported status

This repository is an ecosystem/landing repository for a research and prototype project. It is not represented as an independently audited production system.

The canonical runnable implementation is:

https://github.com/elon00/pq-rdl-blockchain

## Reporting a vulnerability

Please do not disclose exploitable security issues in a public issue.

Use GitHub's private vulnerability reporting / Security Advisory flow for the affected repository when available. Include:

- affected repository, branch, commit, and file
- reproduction steps or proof of concept
- expected impact
- suggested mitigation, if known
- whether credentials, keys, funds, or user data may be exposed

If the issue affects the runnable blockchain implementation, report it against `pq-rdl-blockchain`.

## Security expectations

- Never commit secrets, private keys, seed phrases, API tokens, or operator PII.
- Treat internal tests as engineering evidence, not an independent audit.
- Treat local/demo chain state as non-production unless external deployment evidence is published.
- Rotate any credential immediately if it is ever committed or exposed in logs/history.

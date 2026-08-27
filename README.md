# Calsync.AI

Calsync is a scheduling app for business owners, VIPs, students, and students who need help prioritizing their time.

## Design

This repository uses a small, layered Go design:

- `internal/domain`: domain entities and validation (`Task`)
- `internal/scheduler`: scheduling logic (`Planner`)
- `cmd/calsync`: application entrypoint

## Build and test

```bash
make build
make test
make run
```

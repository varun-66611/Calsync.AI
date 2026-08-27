APP := calsync

.PHONY: build test run

build:
	go build -o bin/$(APP) ./cmd/calsync

test:
	go test ./...

run:
	go run ./cmd/calsync

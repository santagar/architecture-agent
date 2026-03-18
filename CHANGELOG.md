# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [Unreleased]

### Added

- Public OSS governance baseline (community docs, issue/PR templates, CI quality workflow).
- CLI launch discoverability improvements (`help launch`, `launch --help`).
- CLI list output normalization for prompts/workflows (without `.md`).
- Optional clipboard behavior controls with configurable default (`copyOnLaunch`).

## [0.1.3] - 2026-03-18

### Changed

- Package and README alignment for `architecture-agent` naming and package-first usage.
- Launch output now references package retrieval (`npx architecture-agent show ...`) to avoid path ambiguity.

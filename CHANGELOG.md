# Changelog

## v0.4.2

### Added

- CHANGELOG.md file which contains all new changes
- added advanced usage example

### Changed

- updated documentation to describe input types more precisely
- renamed action step

### Removed

- removed CHANGELOG directory

## v0.4.1

### Added

- pull request templated for easier and faster PR creation.
- documentation that you also need to setup the sender repository
- documentation of `token` input
- new output `pull_requests` added, which holds a list of pull request numbers that where included in the release

### Changed

- renamed `gh-token` input to `token`

### Removed

- MongoDB is no longer required. Therefore the following inputs where removed
  - `mongo-uri`
  - `mongo-db`
  - `mongo-collection`

### Fixed

- action was not starting because of a wrong require name in `modules\get-pull_request-merges-between-commits.js`. Changes `./repo-context` to `./context`
- an import was missing

### Uncategorized

The Action now works independently and no longer requires any other action or database.

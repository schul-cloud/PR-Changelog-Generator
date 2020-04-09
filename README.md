# PR Changelog Generator - GitHub Action

A GitHub Action to generate a changelog based on MongoDB date created by the PR Changelog Sender.

## Inputs

### `mongo-uri`

**Required:** true

**Description:** The URL to the MongoDB to push new changes introduced by pull requests to.

**Example:** `mongodb+srv://<username>:<password>@<your-cluster-url>`

### `mongo-db` - default: `pr-changelog`

The database name that should be used.

### `mongo-collection`

**Default:** `pr-changes`

The collection name in the database that should be used.

### `changelog-sections`

**Default:** `["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"]`

The sections by that changes should be grouped for the release.

## Example Usage

### Action

```yaml
name: Test
on:
  release:
    types: [published]

jobs:
  pr-changelog-generator:
    runs-on: ubuntu-latest
    name: "PR Changelog Generator"
    steps:
      - uses: actions/checkout@v1
      - name: Push PR Changelog
        uses: schul-cloud/actions-pull-changelog@master
        with:
          mongo-uri: ${{ secrets.MONGO_URI }}
          mongo-db: "pr-changelog"
          mongo-collection: "pr-changes"
          changelog-sections:
            ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"]
```

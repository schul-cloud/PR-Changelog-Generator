# PR Changelog Generator - GitHub Action

A GitHub Action to generate a changelog based on a Changelog Section in Pull Requests.

## Inputs

### `token`

**Required:** true

**Description:** A Personal Access Token to access the repo. You can also use the `GITHUB_TOKEN` provided by the execution context. This Token needs read access to the current repository.

**Example:** `${{ secrets.GITHUB_TOKEN }}`

### `changelog-sections`

**Default:** `["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"]`

The sections by that changes should be grouped for the release.

## Outputs

### release_tag

The tag of the current release

### pull_requests

A JSON.stringified list of all PRs that are in the current release

### changelog

The markdown formatted changelog.
You can use `echo -e '${{ steps.changelog.outputs.changelog }}' > "CHANGELOG/${{ steps.changelog.outputs.release_tag }}.md"` to write it in a file.

## Example Usage

### PR Format

Each PR must follow the following Schema

```md
# My PR

you can add whatever content you want before the changelog section.
But the Changelog Section must begin with a Level 2 Heading with the exact name `Changelog`.
So `## Changelog` will define the beginning of the changelog section.

## Changelog

## Next Section

If there should be content after the Changelog section, it must have a heading of Level 1 or 2.
Otherwise the content will be added to the `Uncategorized` section of the changelog.
```

### Action

```yaml
name: Release
on:
  release:
    types: [published]

jobs:
  generate-changelog:
    runs-on: ubuntu-latest
    name: Generate Changelog
    id: changelog
    steps:
      - name: generate changelog
        uses: schul-cloud/PR-Changelog-Generator@master
        with:
          token: ${{ secrets.SC_BOT_GITHUB_TOKEN }}
          changelog-sections: '["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security", "Uncategorized"]'
        # env:
        #   ACTIONS_STEP_DEBUG: true
      - name: echo changelog
        run: echo -e '${{ steps.changelog.outputs.changelog }}'
```

const core = require("@actions/core");
const compareVersions = require("compare-versions");

const octokit = require("./octokit");
const { repo, owner } = require("./context");

const getReleaseCommits = async () => {
	core.debug("fetch all tags in repo...");
	const tags = await octokit.paginate("GET /repos/:owner/:repo/tags", {
		owner,
		repo,
	});
	core.debug(`fetched all ${tags.length} tags in repo.`);
	core.debug(`sort tags by semver...`);
	const releaseTags = tags
		.filter((tag) => compareVersions.validate(tag.name))
		.sort((a, b) => compareVersions(a.name, b.name))
		.reverse();
	core.debug(`sorted tags by semver.`);
	return releaseTags;
};

module.exports = getReleaseCommits;

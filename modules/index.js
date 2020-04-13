const core = require("@actions/core");

const { release_tag_name } = require("./context");
const getReleaseCommitRange = require("./get-release-commit-range");
const getPRsBetweenCommits = require("./get-pull_request-merges-between-commits");
const loadPullChanges = require("./get-pull-changes");
const generateChangelog = require("./generate-changelog");

const main = async () => {
	core.info(`Generating changelog for release: "${release_tag_name}"`);
	const { fromSHA, toSHA } = await getReleaseCommitRange();
	core.info(`using commits between ${fromSHA} and ${toSHA}`);
	const prs = await getPRsBetweenCommits(fromSHA, toSHA);
	core.info(`where the pull requests [${prs.join(", ")}] where merged.`);
	core.info(`Loading changes from pull requests...`);
	const changes = await loadPullChanges(prs);
	core.info(`All changes loaded. Generate Changelog...`);
	const changelog = generateChangelog(release_tag_name, changes);
	core.info(`Changelog generated`);

	core.info(changelog);
	core.setOutput("pull_requests", JSON.stringify(prs));
	core.setOutput("changelog", changelog);
};

module.exports = main;

const core = require("@actions/core");

const getReleaseTags = require("./get-release-tags");

const getReleaseCommitRange = async () => {
	core.debug("fetch all releases...");
	const releases = await getReleaseTags();
	core.debug(`fetched all ${releases.length} releases.`);
	const currentReleaseIndex = releases.findIndex(
		(release) => release.name === release_tag_name
	);
	const toSHA = releases[currentReleaseIndex].commit.sha;
	core.debug(`extracted commit sha of current release: "${toSHA}"`);
	const previousReleaseIndex = releases.findIndex(
		(release, index) =>
			index > currentReleaseIndex && release.name !== release_tag_name
	);
	if (previousReleaseIndex === -1) {
		// TODO: handle first release without previous commits
		throw new Error("no previous release to compare found");
	}
	const fromSHA = releases[previousReleaseIndex].commit.sha;
	core.debug(`extracted commit sha of previous release: "${fromSHA}"`);
	return {
		fromSHA,
		toSHA,
	};
};

module.exports = getReleaseCommitRange;

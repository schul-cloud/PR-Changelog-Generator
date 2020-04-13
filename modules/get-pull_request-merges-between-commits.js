const core = require("@actions/core");

const octokit = require("./octokit");
const { repo, owner } = require("./repo-context");

const pullNumberRegex = new RegExp("^Merge pull request #([0-9]+)");

const getPRsBetweenCommits = async (shaStart, shaEnd) => {
	core.debug(`fetch all commits between "${shaStart}" and "${shaEnd}"...`);
	const commitsData = await octokit.request(
		"GET /repos/:owner/:repo/compare/:start...:end",
		{
			owner,
			repo,
			start: shaStart,
			end: shaEnd,
		}
	);
	core.debug(
		`all commits between "${shaStart}" and "${shaEnd}" fetched. (${commitsData.length})`
	);
	core.debug(`extract all pull request numbers for found commits...`);
	const pullNumbers = commitsData.data.commits
		.filter((c) => Boolean(c.commit.message.match(pullNumberRegex)))
		.map((c) => Number(c.commit.message.match(pullNumberRegex)[1]));
	core.debug(
		`found the following ${
			pullNumbers.length
		} pull requests [${pullNumbers.join(", ")}]`
	);
	return pullNumbers;
};

module.exports = getPRsBetweenCommits;

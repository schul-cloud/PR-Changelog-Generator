const core = require("@actions/core");

const octokit = require("./octokit");
const { repo, owner } = require("./context");

const getPrBody = async (pull_number) => {
	core.debug(`fetch PR #${pull_number} body...`);
	const pull = await octokit.request(
		"GET /repos/:owner/:repo/pulls/:pull_number",
		{ owner, repo, pull_number }
	);
	core.debug(`PR #${pull_number} body: "${JSON.stringify(pull.data.body)}"`);
	return pull.data.body;
};

module.exports = getPrBody;

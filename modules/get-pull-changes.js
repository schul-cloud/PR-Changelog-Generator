const core = require("@actions/core");

const getPrBody = require("./get-pr-body");
const prParser = require("./pr-parser");

const getPullChanges = async (pull_numbers) => {
	core.debug("fetch all pull requests bodies...");
	const pullBodys = await Promise.all(
		pull_numbers.map((pull_number) => getPrBody(pull_number))
	);
	core.debug("fetched all pull requests bodies.");
	core.debug("extract changes from pull request bodies...");
	const changes = pullBodys.map(prParser);
	core.debug("all changes from pull request bodies extracted.");
	core.debug(JSON.stringify(changes, undefined, 2));
	return changes;
};

module.exports = getPullChanges;

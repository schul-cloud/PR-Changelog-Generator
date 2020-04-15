const core = require("@actions/core");
const github = require("@actions/github");
const payload = github.context.payload;

core.debug(`Payload: ${JSON.stringify(payload)}`);
if (!payload.repository || !payload.repository.name) {
	throw new Error("payload.repository.name is not defined");
}
if (
	(!payload.organization || !payload.organization.login) &&
	(!payload.repository.owner || !payload.repository.owner.login)
) {
	throw new Error(
		"payload.organization.login and payload.repository.owner.login is not defined. One of them is required"
	);
}
if (!payload.release || !payload.release.tag_name) {
	throw new Error("payload.release.tag_name is not defined");
}

// payload data
const owner = payload.organization
	? payload.organization.login
	: payload.repository.owner.login;
const repo = payload.repository.name;
const release_tag_name = payload.release.tag_name;

// input data
const changelog_sections = JSON.parse(core.getInput("changelog-sections"));
const token = core.getInput("token");

if (!token) {
	throw new Error('"token" input is missing');
}

module.exports = {
	owner,
	repo,
	release_tag_name,
	changelog_sections,
	token,
};

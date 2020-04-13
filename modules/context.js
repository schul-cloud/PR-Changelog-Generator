const core = require("@actions/core");
const github = require("@actions/github");
const payload = github.context.payload;

// TODO: verify existence of variables
if (!payload.organization || !payload.organization.login) {
	throw new Error("payload.organization.login is not defined");
}
if (!payload.repository || !payload.repository.name) {
	throw new Error("payload.repository.name is not defined");
}
if (!payload.tag_name || !payload.release.tag_name) {
	throw new Error("payload.release.tag_name is not defined");
}

// payload data
const owner = payload.organization.login;
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
	owner_id,
	repo,
	repo_id,
	release_tag_name,
	changelog_sections,
	token,
};

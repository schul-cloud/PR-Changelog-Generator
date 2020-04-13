const core = require("@actions/core");
const github = require("@actions/github");
const payload = github.context.payload;

// TODO: verify existence of variables

// payload data
const owner = payload.organization.login;
const owner_id = payload.organization.id;

const repo = payload.repository.name;
const repo_id = payload.repository.id;

const release_tag_name = payload.release.tag_name;

// input data
const changelog_sections = core.getInput("changelog-sections");
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

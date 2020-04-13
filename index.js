const core = require("@actions/core");
const github = require("@actions/github");
const { MongoClient } = require("mongodb");
const compareVersions = require("compare-versions");

const changelogSections = JSON.parse(core.getInput("changelog-sections"));

const payload = github.context.payload;

// TODO: verify existence
const organization = payload.organization.login;
const organizationId = payload.organization.id;

// TODO: verify existence
const repo = payload.repository.name;
const repoId = payload.repository.id;

const mongoUri = core.getInput("mongo-uri");
const mongoDb = core.getInput("mongo-db");
const mongoCollection = core.getInput("mongo-collection");
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

const accessToken = core.getInput("token");
if (!accessToken) {
	throw new Error('"token" input is missing');
}
const octokit = new github.GitHub(accessToken);

const loadChanges = async (query) => {
	let changes = [];
	try {
		const db = await client.db(mongoDb);
		const collection = await db.collection(mongoCollection);
		changes = await collection.find(query).toArray();
	} catch (e) {
		console.error(e);
	}
	changes = changes.sort((a, b) =>
		("" + a.merged_at).localeCompare(b.merged_at)
	);
	return changes;
};

const generateChangelog = (release, changes) => {
	let changelog = [`## ${release}\n`];
	changelogSections.forEach((section) => {
		const sectionChanges = changes.reduce(
			(merge, change) => merge.concat(change.changes[section] || []),
			[]
		);
		if (sectionChanges.length === 0) {
			return changelog;
		}
		changelog.push(`### ${section}\n`);
		changelog = changelog.concat(sectionChanges);
		changelog.push("");
	});
	if (changelog.length === 1) {
		changelog.push("no changes documented"); // TODO: make this text configurable
	}
	return changelog.join("\n");
};

const getPRsBetweenCommits = async (shaStart, shaEnd) => {
	const commitsData = await octokit.request(
		"GET /repos/:owner/:repo/compare/:start...:end",
		{
			owner: organization,
			repo,
			start: shaStart,
			end: shaEnd,
		}
	);
	const pullNumberRegex = new RegExp("^Merge pull request #([0-9]+)");
	const pullNumbers = commitsData.data.commits
		.filter((c) => Boolean(c.commit.message.match(pullNumberRegex)))
		.map((c) => Number(c.commit.message.match(pullNumberRegex)[1]));
	return pullNumbers;
};

const getReleaseCommits = async () => {
	const tags = await octokit.paginate("GET /repos/:owner/:repo/tags", {
		owner: organization,
		repo,
	});
	const releaseTags = tags
		.filter((tag) => compareVersions.validate(tag.name))
		.sort((a, b) => compareVersions(a.name, b.name))
		.reverse();
	return releaseTags;
};

const main = async () => {
	const releaseName = (payload.release || {}).tag_name || "v0.0.2-rc.3";
	core.debug(`RELEASE: ${releaseName}`);
	const releases = await getReleaseCommits();
	core.debug(`RELEASES: ${JSON.stringify(releases, undefined, 2)}`);
	const currentReleaseIndex = releases.findIndex(
		(release) => release.name === releaseName
	);
	// TODO: handle first release without previous commits
	const previousReleaseIndex = releases.findIndex(
		(release, index) =>
			index > currentReleaseIndex && release.name !== releaseName
	);
	core.debug(
		`Generate Changelog for commits between ${releases[currentReleaseIndex].commit.sha} and ${releases[previousReleaseIndex].commit.sha}`
	);
	let pulls = await getPRsBetweenCommits(
		releases[currentReleaseIndex].commit.sha,
		releases[previousReleaseIndex].commit.sha
	);
	core.setOutput("merged_pull_requests", pulls);
	core.debug(
		`Found the following PRs since the last release: [${pulls.join(", ")}]`
	);
	await client.connect();
	const releaseQuery = {
		organizationId,
		repoId,
		number: { $in: pulls },
	};
	const changes = await loadChanges(releaseQuery);
	const changelog = generateChangelog(releaseName, changes);
	core.info(changelog);
	core.setOutput("changelog", changelog);
};

main()
	.catch((error) => core.setFailed(error.message))
	.finally(() => {
		client.close();
	});

const core = require("@actions/core");
const github = require("@actions/github");
const { MongoClient } = require("mongodb");

const changelogSections = JSON.parse(core.getInput("changelog-sections"));

const mongoUri = core.getInput("mongo-uri");
const mongoDb = core.getInput("mongo-db");
const mongoCollection = core.getInput("mongo-collection");
const client = new MongoClient(mongoUri);

const payload = github.context.payload;

const loadChanges = async (query) => {
	let changes = [];
	try {
		await client.connect();
		const db = await client.db(mongoDb);
		const collection = await db.collection(mongoCollection);
		changes = await collection.find(query).toArray();
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
	changes = changes.sort((a, b) =>
		("" + a.merged_at).localeCompare(b.merged_at)
	);
	return changes;
};

const tagReleasedChanges = async (release, query) => {
	try {
		await client.connect();
		const db = await client.db(mongoDb);
		const collection = await db.collection(mongoCollection);
		await collection.updateMany(query, { $set: { release: release } });
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
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
	return changelog.join("\n");
};

const main = async () => {
	const release = payload.tag_name || "v0.0.0-test";
	const releaseBranch = payload.target_commitish || "master";
	console.log(release, releaseBranch);
	const releaseQuery = {
		$or: [{ release: null }, { release: release }],
		merged_to: releaseBranch,
	};

	const changes = await loadChanges(releaseQuery);
	console.log(JSON.stringify(changes, undefined, 2));
	const changelog = generateChangelog(release, changes);
	console.log(JSON.stringify(changelog, undefined, 2));
	core.setOutput("changelog", changelog);
	await tagReleasedChanges(release, releaseQuery);
	console.log("tagged released changes");
};

main().catch((error) => core.setFailed(error.message));

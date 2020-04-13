const core = require("@actions/core");

const { changelog_sections } = require("./context");

const extractChanges = (mdPullBody) => {
	core.debug(`extract changes from pr body... "${JSON.stringify(mdPullBody)}"`);
	const rows = mdPullBody
		.split(/\r?\n/)
		.map((s) => s.trimRight())
		.filter(Boolean);

	let inChangelogSection = false;
	let currentSection = "Uncategorized";
	const changes = {};

	rows.forEach((row) => {
		if (row.match(new RegExp("^## Changelog$"))) {
			inChangelogSection = true;
			return;
		}
		if (inChangelogSection && row.match(new RegExp("^##? "))) {
			inChangelogSection = false;
			return;
		}
		if (!inChangelogSection) {
			return;
		}

		const newSection = row.match(
			new RegExp(`^### (${changelog_sections.join("|")})$`)
		);
		if (newSection) {
			currentSection = newSection[1];
			return;
		} else if (inChangelogSection && row.match(new RegExp("^###? .*"))) {
			currentSection = "Uncategorized";
			row = `**${row.match(new RegExp("^###? (.*)"))[1]}:**`;
		}

		if (!changes[currentSection]) {
			changes[currentSection] = [];
		}
		changes[currentSection].push(row);
	});
	core.debug(
		`extracted changes from pr body:\n${JSON.stringify(changes, undefined, 2)}`
	);
	return changes;
};

module.exports = extractChanges;

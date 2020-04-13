const { changelog_sections } = require("./context");

const generateChangelog = (release, changes) => {
	let changelog = [`## ${release}\n`];
	changelog_sections.forEach((section) => {
		const sectionChanges = changes.reduce(
			(merge, change) => merge.concat(change[section] || []),
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

module.exports = generateChangelog;

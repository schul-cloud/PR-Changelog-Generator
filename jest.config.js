const nock = require("nock");
nock.disableNetConnect();

module.exports = {
	testMatch: ["**/(*.)test.js"],
	coverageDirectory: "<rootDir>/coverage",
	collectCoverageFrom: [
		// Nuxt extensions
		"<rootDir>/modules/**/*.js",
	],
};

const nock = require("nock");
nock.disableNetConnect();

module.exports = {
	testMatch: ["**/(*.)test.js"],
	coverageDirectory: "<rootDir>/coverage",
	collectCoverageFrom: [
		"<rootDir>/modules/**/*.js",
		"!<rootDir>/modules/context.js",
	],
};

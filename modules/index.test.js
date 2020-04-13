jest.mock("./context");
const core = require("@actions/core");
const nock = require("nock");

const { owner, repo } = require("./__mocks__/context");
const mockAPICall = (requestPath, mockDataPath) => {
	nock("https://api.github.com")
		.get(requestPath)
		.reply(200, require(mockDataPath));
};

const mockPulls = (ids) => {
	ids.forEach((id) => {
		mockAPICall(
			`/repos/schul-cloud/PR-Changelog-Generator/pulls/${id}`,
			`../mock-data/pull_${id}`
		);
	});
};
mockPulls([3, 4, 5, 6, 7, 8, 9]);
mockAPICall(`/repos/${owner}/${repo}/tags`, "../mock-data/tags");
mockAPICall(
	`/repos/schul-cloud/PR-Changelog-Generator/compare/3f699fb44c46f22cd3ce937a58263d2a468a6e92...74fc76826aefa45551b036524b9a1db05fb51f86`,
	"../mock-data/compare"
);

const run = require("./index");

describe("action", () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it("can be executed", async () => {
		jest.spyOn(core, "info").mockImplementation();
		jest.spyOn(core, "debug").mockImplementation();
		const setOutputMock = jest.spyOn(core, "setOutput").mockImplementation();
		await run();
		expect(setOutputMock.mock.calls).toMatchSnapshot();
	});
});

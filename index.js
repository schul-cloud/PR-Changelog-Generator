const run = require("./modules/index");
try {
	run();
} catch (error) {
	core.setFailed(`Action failed with error ${error}`);
}

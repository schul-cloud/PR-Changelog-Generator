const github = require("@actions/github");

const { token } = require("./context");
module.exports = new github.GitHub(token);

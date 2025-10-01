const path = require("path");
const fs = require("fs");

function randId() {
    return Math.floor(Math.random() * 1_000_000);
}

/**
 * Read the config file in a sync way.
 * It's used readFileSync for bundle compatibility because the resources folder is outside the bundle.
 * @param {string} path
 */
function readConfigFile() {
    const isPkg = typeof process.pkg !== "undefined";
    const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;
    const configPath = path.join(baseDir, "resources", "config.json");
    const configData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configData);
}

module.exports = { randId, readConfigFile };

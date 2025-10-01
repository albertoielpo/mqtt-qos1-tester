const path = require("path");
const fs = require("fs");

/**
 * Generate a random number between 0 and max.
 * If max is undefined then use 1_000_000
 * @param {number} max
 * @returns
 */
function randId(max = 1_000_000) {
    return Math.floor(Math.random() * max);
}

/**
 * Read the config file in a sync way.
 * It's used readFileSync for bundle compatibility because the resources folder is outside the bundle.
 */
function readConfigFile() {
    const isPkg = typeof process.pkg !== "undefined";
    const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;
    const configPath = path.join(baseDir, "resources", "config.json");
    const configData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configData);
}

module.exports = { randId, readConfigFile };

const fs = require("fs");
const path = require("path");
const MqttClient = require("./mqtt-client");

const isPkg = typeof process.pkg !== "undefined";
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;
const configPath = path.join(baseDir, "resources", "config.json");
const configData = fs.readFileSync(configPath, "utf8");
const mqttClientOpts = JSON.parse(configData);
function randId() {
    return Math.floor(Math.random() * 1_000_000);
}

/**
 * Main wrap function
 */
function main() {
    const publishInterval = mqttClientOpts.publishInterval || 10_000;
    const testDuration = mqttClientOpts.testDuration || 60_000;

    const curClientId = `${mqttClientOpts.clientId}_${randId()}`;
    // create new client
    const mqttClient = new MqttClient({
        protocol: mqttClientOpts.protocol,
        port: mqttClientOpts.port,
        host: mqttClientOpts.host,
        username: mqttClientOpts.username,
        password: mqttClientOpts.password,
        clientId: curClientId,
        logFile: mqttClientOpts.logSenderFile
    });

    // publish to a topic
    const intervalId = setInterval(() => {
        mqttClient.publish({
            topic: mqttClientOpts.topic,
            payload: {
                status: "ok",
                payloadId: randId()
            }
        });
    }, publishInterval);

    // close client gracefully
    setTimeout(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        // then close the connection
        mqttClient.end();
    }, testDuration);
}

if (require.main === module) {
    // here if is launched as a script
    try {
        console.log("Main sender start as script");
        main();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { main };

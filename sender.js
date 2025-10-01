const MqttClient = require("./mqtt-client.js");
const { randId, readConfigFile } = require("./utils.js");
const mqttClientOpts = readConfigFile();

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
        logFile: mqttClientOpts.logSenderFile,
        consolePrefix: "[S]"
    });

    const gracefulEnd = () => {
        mqttClient.end();
        process.exit(0);
    };

    process.on("SIGINT", gracefulEnd); // Ctrl+C or kill -2
    process.on("SIGTERM", gracefulEnd); // standard kill command

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
        gracefulEnd();
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

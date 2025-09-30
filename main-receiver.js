const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

function randId() {
    return Math.floor(Math.random() * 1_000_000);
}

/**
 * Main wrap function
 */
function main() {
    const testDuration = mqttClientOpts.testDuration || 60_000;

    // create new client
    const curClientId = `${mqttClientOpts.clientId}_${randId()}`;
    // create new client
    const mqttClient = new MqttClient({
        protocol: mqttClientOpts.protocol,
        port: mqttClientOpts.port,
        host: mqttClientOpts.host,
        username: mqttClientOpts.username,
        password: mqttClientOpts.password,
        clientId: curClientId,
        logFile: mqttClientOpts.logReceiverFile
    });

    // subscribe to a topic
    setTimeout(() => {
        mqttClient.subscribe({
            topic: mqttClientOpts.topic
        });
    }, 1000);

    // close client gracefully
    setTimeout(() => {
        // then close the connection
        mqttClient.end();
    }, testDuration);
}

if (require.main === module) {
    // here if is launched as a script
    try {
        console.log("Main receiver start as script");
        main();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { main };

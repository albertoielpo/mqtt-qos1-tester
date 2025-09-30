const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

const TEST_DURATION = 60_000;

/**
 * Main wrap function
 */
function main() {
    // create new client
    const mqttClient = new MqttClient({
        ...mqttClientOpts,
        clientId: `${mqttClientOpts.clientId}_${Math.floor(
            Math.random() * 100000
        )}`
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
    }, TEST_DURATION);
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

const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

const TEST_DURATION = 60_000;

/**
 * Main wrap function
 */
function receiver() {
    // create new client
    const mqttClient = new MqttClient(mqttClientOpts);

    // subscribe to a topic
    setTimeout(() => {
        mqttClient.subscribe({
            topic: "test/1"
        });
    }, 1000);

    // close client gracefully
    setTimeout(() => {
        // then close the connection
        mqttClient.end();
    }, TEST_DURATION);
}

if (require.receiver === module) {
    // here if is launched as a script
    try {
        receiver();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { receiver };

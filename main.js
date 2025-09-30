const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

const PUBLISH_INTERVAL = 5000;
const TEST_DURATION = 60_000;

/**
 * Main wrap function
 */
function main() {
    // create new client
    const mqttClient = new MqttClient(mqttClientOpts);

    // subscribe to a topic
    setTimeout(() => {
        mqttClient.subscribe({
            topic: "test/1"
        });
    }, 1000);

    // publish to a topic
    const intervalId = setInterval(() => {
        mqttClient.publish({
            topic: "test/1",
            payload: {
                status: "ok",
                who: mqttClientOpts.clientId
            }
        });
    }, PUBLISH_INTERVAL);

    // close client gracefully
    setTimeout(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        // then close the connection
        mqttClient.end();
    }, TEST_DURATION);
}

if (require.main === module) {
    // here if is launched as a script
    try {
        main();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { main };

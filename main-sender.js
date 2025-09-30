const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

const PUBLISH_INTERVAL = 5000;
const TEST_DURATION = 60_000;

/**
 * Main wrap function
 */
function sender() {
    // create new client
    const mqttClient = new MqttClient(mqttClientOpts);

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

if (require.sender === module) {
    // here if is launched as a script
    try {
        sender();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { sender };

const MqttClient = require("./mqtt-client");
const mqttClientOpts = require("./resources/config.json");

const PUBLISH_INTERVAL = 5000;
const TEST_DURATION = 60_000;

/**
 * Main wrap function
 */
function main() {
    const curClientId = `${mqttClientOpts.clientId}_${Math.floor(
        Math.random() * 100000
    )}`;
    // create new client
    const mqttClient = new MqttClient({
        ...mqttClientOpts,
        clientId: curClientId
    });

    // publish to a topic
    const intervalId = setInterval(() => {
        mqttClient.publish({
            topic: mqttClientOpts.topic,
            payload: {
                status: "ok",
                who: curClientId
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
        console.log("Main sender start as script");
        main();
    } catch (error) {
        console.log("Exception raised: ", error);
        process.exit(1); // return 1
    }
}

module.exports = { main };

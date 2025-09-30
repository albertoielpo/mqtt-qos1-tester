/**
 * @author Alberto Ielpo
 *
 * This program creates an mqtt sender and a mqtt receiver using the same node process
 * The goal is to log the QoS 1 flow analysing network congestion and package duplications
 * Inside the resources folder is defined the config parameters
 * Inside the log folder will be created the log files
 *
 * mqtt-client module contains the mqtt client logic (require mqtt library)
 * sender contains the publish polling logic
 * receiver contains the subscription logic
 */
const sender = require("./sender.js").main;
const receiver = require("./receiver.js").main;

try {
    console.log(">> start");
    sender();
    receiver();
} catch (error) {
    console.log(error);
    process.exit(1);
}

const sender = require("./sender.js").main;
const receiver = require("./receiver.js").main;

try {
    console.log(">> start");
    // execute in the same thread
    sender();
    receiver();
} catch (error) {
    console.log(error);
    process.exit(1);
}

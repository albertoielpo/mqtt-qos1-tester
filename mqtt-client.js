const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

class MqttClient {
    consolePrefix; // prepend this string to any this.log function
    logFile = "./log/mqtt-client.log"; // It can be override using opts.logFile
    client = null; // mqtt instance

    /**
     * Init class
     * @param {{protocol: "mqtt" | "mqtts", port: string, host: string, username: string, password: string, clientId: string, logFile: string, consolePrefix: string}} opts
     */
    constructor(opts = {}) {
        if (opts.logFile) {
            this.logFile = this.sanitizeLogPath(opts.logFile);
        }
        if (opts.consolePrefix) {
            this.consolePrefix = opts.consolePrefix;
        }
        console.log(">> Log linked: ", this.logFile);

        this.log({
            event: `client-connecting`,
            packet: { payload: Buffer.from(opts.clientId) }
        });
        this.client = mqtt.connect({
            host: opts.host,
            protocol: opts.protocol,
            port: opts.port,
            username: opts.username,
            password: opts.password,
            clientId: opts.clientId
        });

        this.client.on("connect", (packet) => {
            if (packet) {
                this.log({ event: "connect", packet });
            }
        });
        this.client.on("reconnect", (packet) => {
            if (packet) {
                this.log({ event: "reconnect", packet });
            }
        });

        this.client.on("message", (topic, payload, packet) => {
            if (packet) {
                this.log({
                    event: "message",
                    topic,
                    payload,
                    packet
                });
            }
        });

        this.client.on("error", (error) => {
            if (error) {
                this.log({ error, event: "error" });
            }
        });

        this.client.on("packetsend", (packet) => {
            if (packet) {
                this.log({ event: "packetsend", packet });
            }
        });

        this.client.on("packetreceive", (packet) => {
            if (packet) {
                this.log({ event: "packetreceive", packet });
            }
        });

        this.client.on("close", () => {
            this.log({ event: "close", packet: {} });
        });
        this.client.on("disconnect", (packet) => {
            this.log({ event: "disconnect", packet });
        });
        this.client.on("offline", () => {
            this.log({ event: "offline", packet: {} });
        });
    }

    /**
     * Sanitize log in order to avoid path traversal
     * @param {string} file
     * @param {string} baseDir
     * @returns
     */
    sanitizeLogPath(file, baseDir = "./log") {
        // Remove null bytes and control characters
        let sanitized = file
            .replace(/\0/g, "")
            .replace(/[\x00-\x1f\x80-\x9f]/g, "");

        // Get just the filename if path traversal is attempted
        const basename = path.basename(sanitized);

        // Remove or replace potentially dangerous characters
        const safe = basename.replace(/[^a-zA-Z0-9._-]/g, "_");

        // Ensure it doesn't start with a dot (hidden file)
        const final = safe.startsWith(".") ? `log_${safe}` : safe;

        // Resolve to absolute path within a safe directory
        return path.resolve(baseDir, final);
    }

    /**
     * Log in a centralized way
     * @param {{error: unknown, event: string, topic: string, packet: {cmd: string, messageId: number, payload: Buffer}}} data
     * @returns
     */
    log(data = {}) {
        let str;
        if (data.error) {
            str = `[${new Date().toISOString()}] [error] ${
                data.error?.toString() ?? ""
            }`;
        } else {
            str = `[${new Date().toISOString()}] [${data.event}] [${
                data.packet?.cmd ?? ""
            }] [${data.packet?.messageId ?? ""}] [${
                data.packet?.payload?.toString() ?? ""
            }]`;
        }

        console.log(
            this.consolePrefix ?? "",
            str,
            data.packet?.cmd === "puback" ? "🟢" : ""
        ); // console log
        fs.appendFile(`${this.logFile}`, str + "\n", () => {}); // append to file
    }

    /**
     * Publish a message via mqtt
     * @param {{topic: string, payload: object}} opts
     * @returns
     */
    publish(opts = {}) {
        if (!this.client) return;
        if (!opts.topic) {
            this.log({ event: "error", error: "Missing topic" });
            throw new Error("Publish error due to missing topic");
        }

        const payload = opts.payload || {};

        this.client.publish(
            opts.topic,
            JSON.stringify(payload),
            {
                qos: opts.qos || 1
            },
            (error, packet) => {
                if (error) {
                    this.log({ event: "published-error", error });
                    return;
                }
                if (packet) {
                    this.log({ event: "published", packet });
                }
            }
        );
    }

    /**
     * Subscribe to a topic
     * @param {{topic: string}} opts
     * @returns
     */
    subscribe(opts = {}) {
        if (!this.client) return;
        if (!opts.topic) {
            this.log({ event: "error", error: "Missing topic" });
            throw new Error("Subscribe error due to missing topic");
        }
        this.client.subscribe(opts.topic, (error, granted, packet) => {
            if (error) {
                this.log({ event: "subscribe-error", error });
                return;
            }

            // if (granted) console.log("subscribe granted: ", granted);
            if (packet) {
                this.log({ event: "subscribe-packet", packet });
            }
        });
    }

    /**
     * Close a connection
     * @returns
     */
    end() {
        if (!this.client) return;
        this.client.end();
    }
}

module.exports = MqttClient;

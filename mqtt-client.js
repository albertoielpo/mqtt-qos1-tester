const mqtt = require("mqtt");
const fs = require("fs");

class MqttClient {
    client = null; // mqtt instance

    /**
     *
     * @param {{error: any, event: string, topic: string, payload: Buffer, packet: {cmd: string, messageId: number}}} data
     * @returns
     */
    log(data = {}) {
        let str;
        if (data.error) {
            str = `[${new Date().toISOString()}] [error] ${data.error?.toString()}`;
        } else {
            str = `[${new Date().toISOString()}] [${data.event}] [${
                data.packet?.cmd ?? ""
            }] [${data.packet?.messageId ?? ""}]`;
        }

        console.log(str, data.packet?.cmd === "puback" ? "🟢" : ""); // console log
        fs.appendFile("./log/mqtt-client.log", str + "\n", () => {}); // append to file
    }

    /**
     *
     * @param {{protocol: "mqtt" | "mqtts", port: string, host: string, username: string, password: string, clientId: string}} opts
     */
    constructor(opts = {}) {
        this.log({ event: "client-connecting" });
        this.client = mqtt.connect(opts);

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
     *
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
     *
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

    end() {
        if (!this.client) return;
        this.client.end();
    }
}

module.exports = MqttClient;

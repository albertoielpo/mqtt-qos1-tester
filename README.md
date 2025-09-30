# Mqtt Qos 1 tester

The aim of this project is to dispatch some test message with QoS 1 and log all the steps.

The goal is to trace the puback response and if some packages are duplicated or arrives with delay.

## Start

### Requirements

-   node
-   resources/config.json properly edited

```bash
npm install
npm run start
```

## Bundle

### Requirements

-   node
-   linux
-   zip

```bash
npm install
npm run bundle
```

Bundle zip file are <code>dist/mqtt-qos1-tester-linux.zip</code> and <code>dist/mqtt-qos1-tester-win.zip</code>

Once extracted edit properly resources/config.json

Do not delete log folder!

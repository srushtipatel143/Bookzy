const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "consumer-app",
  brokers: ["192.168.0.103:9092"],
  requestTimeout: 30000,
});

module.exports = kafka;
const Kafka  = require("./kafkaConfig");

async function createTopics(topic, numberOfPartion) {
  const admin = Kafka.admin();
  await admin.connect();

  const topicList = await admin.listTopics();
  if (topicList.includes(topic)) {
    await admin.disconnect();
    return;
  }
  await admin.createTopics({
    topics: [
      {
        topic: topic,
        numPartitions: numberOfPartion,
      },
    ],
    timeout: 5000,
    validateOnly: false,
  });
  await admin.disconnect();
}

async function connectProducer() {
  const producer = Kafka.producer();
  await producer.connect();
  return producer;
}

async function produceMessage(topic, numberOfPartion, key, message) {
  await createTopics(topic, numberOfPartion);
  const producer = await connectProducer(); 
  await producer.send({
    topic,
    messages: [{ 
      numberOfPartion,
      key, 
      value: JSON.stringify(message) }],
  });

  await producer.disconnect();
}

module.exports = { produceMessage };
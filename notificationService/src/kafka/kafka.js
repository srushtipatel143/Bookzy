const kafka = require("./kafkaConfig");
const sendMail = require("../helpers/libraries/sendEmail");
const exp = require("constants");

async function init() {

    try {
        const consumer = kafka.consumer({
            groupId: "email-group",
            sessionTimeout: 20000,
            heartbeatInterval: 3000,
        });
        await consumer.connect();
        const admin = kafka.admin();
        await admin.connect();
        let topics = await admin.listTopics();

        await admin.disconnect();
        topics = topics.filter(topic => !topic.startsWith("__"));
        if (topics.length === 0) {
            return;
        }


        await consumer.subscribe({ topics, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const emailData = JSON.parse(message.value.toString());
                    await sendMail(emailData);

                } catch (error) {
                    return next(new errorHandler("Something went wrong", 500, error));
                }
            }
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}


// init();
module.exports = { init };
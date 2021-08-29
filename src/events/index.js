const httpContext = require("express-http-context").ns;
const AWS = require("aws-sdk");
const { Consumer } = require("sqs-consumer");
const { v4: uuidv4 } = require("uuid");
const logs = require("../logs");

const validatorJson = require("../validators/validatorJson");
const { NewOrder } = require("../services/SqsServices/Order");

AWS.config.update({ region: "us-east-2" });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05", region: "us-east-2" });

const queueUrl = process.env.AWS_QUEUE;

const sqsEvents = async (message, event) => {
  const obj = {
    NewOrder: await NewOrder(message),
  };

  return obj[event];
};

function CreateConsumers() {
  logs.info(`Initing ${queueUrl}`);

  const consumer = Consumer.create({
    queueUrl,
    sqs,
    handleMessage: async (message) => {
      const orderData = validatorJson(message.Body) && JSON.parse(message.Body);
      await httpContext.runAndReturn(async () => {
        const requestId = orderData.request_id || uuidv4();

        httpContext.set("requestId", requestId);

        logs.info(message.Body);

        await sqsEvents(orderData.data, orderData.event);

        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        sqs.deleteMessage(deleteParams, function (error, data) {
          if (error) {
            logs.error(`Delete Error ${error}`);
          } else {
            logs.info(`Message Deleted ${data}`);
          }
        });
      });
    },
  });

  consumer.on("error", (err) => {
    logs.error(err.message);
  });

  consumer.on("processing_error", (err) => {
    logs.error(err.message);
  });

  consumer.on("timeout_error", (err) => {
    logs.error(err.message);
  });

  consumer.start();

  logs.info(`Started ${queueUrl}`);
}

module.exports = CreateConsumers;

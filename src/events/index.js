const AWS = require("aws-sdk");
const { sendLogInfo, sendLogError } = require("../logs/coralogix");
const cron = require("node-cron");

AWS.config.update({ region: "us-east-2" });
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueUrl = process.env.AWS_QUEUE_STAGING;

const params = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

cron.schedule("* * * * *", () => {
  sqs.receiveMessage(params, (err, message) => {
    if (err) {
      console.log(err, err.stack);
      sendLogError({ data: `Queue error ${err}`, name: "ERROR" });
    } else {
      if (!message.Messages) {
        sendLogInfo({ data: "Nothing to process", name: "INFO" });
        console.log("Nothing to process");
        return;
      }
      const orderData = message.Messages[0].Body;
      sendLogInfo({ data: orderData, name: "INFO" });

      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.Messages[0].ReceiptHandle,
      };
      sqs.deleteMessage(deleteParams, function (error, data) {
        if (error) {
          console.log("Delete Error", error);
          sendLogError({ data: `Delete Error ${error}`, name: "ERROR" });
        } else {
          console.log("Message Deleted", data);
          sendLogInfo({ data: `Message Deleted ${data}`, name: "INFO" });
        }
      });
    }
  });
});

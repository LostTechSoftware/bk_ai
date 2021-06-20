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
  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      sendLogError({ data: `Queue error ${err}`, name: "ERROR" });
    } else {
      if (!data.Messages) {
        sendLogInfo({ data: "Nothing to process", name: "INFO" });
        console.log("Nothing to process");
        return;
      }
      const orderData = data.Messages[0].Body;
      sendLogInfo({ data: orderData, name: "INFO" });

      var deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };
      sqs.deleteMessage(deleteParams, function (err, data) {
        if (err) {
          console.log("Delete Error", err);
          sendLogError({ data: `Delete Error ${err}`, name: "ERROR" });
        } else {
          console.log("Message Deleted", data);
          sendLogInfo({ data: `Message Deleted ${data}`, name: "INFO" });
        }
      });
    }
  });
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const sendSms = async (options) => {
  await client.messages
    .create({
      body: options.message,
      from: process.env.VERIFIED_PHONE_SENDER,
      to: options.to,
    })
    .then((message) => console.log(message));
};

module.exports = sendSms;

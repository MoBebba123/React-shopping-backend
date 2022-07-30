const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendEmail = async (option) => {


  const msg = {
    to: option.email,
    from: 'mohamedbebba1@gmail.com', // Change to your verified sender
    subject: option.subject,
    text: option.message,

  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })


}
module.exports = sendEmail;

const express = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_GMAIL_REDIRECT_URI,
});

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { sender_name, to } = req.body;
    try {
      const accessToken = (await oAuth2Client.getAccessToken()).token;

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: ADMIN_EMAIL,
          accessToken,
        },
      });

      const mailOptions = {
        from: ADMIN_EMAIL,
        to,
        subject: 'Thanks from cloutcoders team',
        text: 'Thank you for using our service!',
      };

      mailOptions.html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for using our service! | cloutcoders</title>
      </head>
      <body>
        <main>
          <h1>Thank You for using our services!</h1>
          <p>Dear ${sender_name},</p>
          <p style="text-indent: 30px;">You used our web services. Thank you for spending your time on our website.
          </p>
        </main>
        <small style="font-weight: 400;">from team <a href="https://cloutcoders.vercel.com">cloutcoders</a>.</small>
      </body>
    </html>`;

      await transport.sendMail(mailOptions);
    } catch (err) {
      res.status(500);
      throw new Error('internal server error');
    }

    res.status(200).end();
  })
);

module.exports = router;

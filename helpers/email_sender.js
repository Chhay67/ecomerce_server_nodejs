const nodemailer = require('nodemailer');


exports.sendMail = async (email, subject, body, successMessage, errorMessage) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: body
    };

    return new Promise((resolve) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                resolve({ statusCode: 500, message: errorMessage });
            } else {
                console.log('Email sent:', info.response);
                resolve({ statusCode: 200, message: successMessage });
            }
        });
    });
};

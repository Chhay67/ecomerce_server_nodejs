const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../helpers/email_sender');

exports.register = async function (req, res) {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const errorMessages = errors.array().map(error => ({
               field: error.path,
               message: error.msg,
          }));
          return res.status(400).json({ errors: errorMessages });
     }
     try {

          let user = new User({
               ...req.body,
               passwordHash: bcrypt.hashSync(req.body.password, 8), // Assuming password is hashed before saving
          });


          user = await user.save();
          if (!user) {
               return res.status(400).json({ message: 'User registration failed' });
          }
          return res.status(201).json(user);

     } catch (error) {
          console.error('Error during registration:', error);
          if (error.message.includes('email_1 dup key')) {
               return res.status(400).json({ type: "AuthError", message: 'Email already exists.' });
          }

          return res.status(500).json({ type: error.name, message: error.message });

     }
};

exports.login = async function (req, res) {
     try {

          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }
          if (!bcrypt.compareSync(password, user.passwordHash)) {
               return res.status(400).json({ message: 'Invalid password' });
          }

          const accessToken = jwt.sign(
               {
                    id: user.id,
                    isAdmin: user.isAdmin
               },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: '24h' },
          );
          const refreshToken = jwt.sign(
               {
                    id: user.id,
                    isAdmin: user.isAdmin
               },
               process.env.REFRESH_TOKEN_SECRET,
               { expiresIn: '60d' },
          );
          const token = await Token.findOne({ userId: user.id });
          if (token) {
               await token.deleteOne();
          }
          await new Token({ userId: user.id, accessToken, refreshToken, }).save();
          user.passwordHash = undefined;
          return res.status(200).json({ ...user._doc, accessToken });

     } catch (error) {
          console.error('Error during login:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
};

exports.verifyToken = async function (req, res) {
     try {
          let accessToken = req.headers.authorization;
          if (!accessToken) return res.json(false);
          accessToken = accessToken.replace('Bearer', '').trim();
          // get token from db
          const token = Token.findOne({ accessToken });
          if (!token) return res.json(false);
          //decode refreshToken 
          const tokenData = jwt.decode(token.refreshToken);
          // get user from db
          const user = User.findOne(tokenData.userId);
          if (!user) return res.json(false);
          // verify refreshToken 
          const isValidToken = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
          if (!isValidToken) return res.json(false);
          return res.json(true);
     } catch (error) {
          console.error('verifyToken:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}
exports.forgetPassword = async function (req, res) {
     try {
          const { email } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(404).json({ message: 'User with that email not exist.' });
          }
          const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
          user.resetPasswordOtp = otp;
          user.resetPasswordOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
          await user.save();
          const response = await mailSender.sendMail(
               email,
               'Password Reset OTP',
               `<p>Your OTP for password reset is <strong>${otp}</strong>. It is valid for 15 minutes.</p>`,
               'OTP sent successfully',
               'Failed to send OTP'
          );
          if (response.statusCode !== 200) {
               return res.status(response.statusCode).json({ message: response.message });
          }
          return res.status(200).json({ message: 'OTP sent successfully' });

     } catch (error) {
          console.error('Error during forget password:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
};

exports.verifyPasswordResetOTP = async function (req, res) {
     try {
          const { email, otp } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(404).json({ message: 'User with that email not exist.' });
          }
          if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp ||  Date.now() > user.resetPasswordOtpExpires ) {
               return res.status(401).json({ message: 'Invalid OTP' });
          }
          user,resetPasswordOtp = 1; // Clear OTP after verification
          user.resetPasswordOtpExpires = undefined; // Clear OTP expiration
          await user.save();
          return res.status(200).json({ message: 'OTP verified successfully' });
     } catch (error) {
          console.error('Error during verify password reset OTP:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
};

exports.resetPassword = async function (req, res) {
     try {
          const { email, newPassword } = req.body;
          const user = await User.findOne({ email });
          if (!user) {   
               return res.status(404).json({ message: 'User with that email not exist.' });
          }
          if (user.resetPasswordOtp !== 1) {
               return res.status(401).json({ message: 'Confirm Otp Before resetting password.' });
          }
          user.passwordHash = bcrypt.hashSync(newPassword, 8); // Hash the new password
          user.resetPasswordOtp = undefined; // Clear OTP after password reset
          await user.save();
          return res.status(200).json({ message: 'Password reset successfully' });
     } catch (error) {
          console.error('Error during reset password:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
};
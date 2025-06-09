const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
          if(!user) return res.json(false);
          // verify refreshToken 
          const isValidToken = jwt.verify(token.refreshToken,process.env.REFRESH_TOKEN_SECRET);
          if(!isValidToken) return res.json(false);
          return res.json(true);
     } catch (error) {
          return res.status(500).json({ type: error.name, message: error.message });
     }
}
exports.forgetPassword = async function (req, res) {

};

exports.verifyPasswordResetOTP = async function (req, res) {

};

exports.resetPassword = async function (req, res) {

};
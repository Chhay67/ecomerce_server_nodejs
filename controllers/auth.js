const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');

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
          if(error.message.includes('email_1 dup key')) {
               return res.status(400).json({ type: "AuthError",message: 'Email already exists.' });
          }

          return res.status(500).json({ message: 'Internal server error' });

     }
};

exports.login = async function (req, res) {

};


exports.forgetPassword = async function (req, res) {

};

exports.verifyPasswordResetOTP = async function (req, res) {

};

exports.resetPassword = async function (req, res) {

};
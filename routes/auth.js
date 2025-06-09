const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator');
const validatorUser = [
     body('email').isEmail().withMessage('Please enter a valid email address'),
     body('name').not().isEmpty().withMessage('Name is required'),
     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
     body('phone').isMobilePhone()
.withMessage('Please enter a valid phone number'),
];


router.get('verify-token',authController.verifyToken);

router.post('/login',authController.login);

router.post('/register',validatorUser,authController.register);

router.post('/forgot-password', authController.forgetPassword);

router.post('/reset-password', authController.resetPassword);

router.post('/verify-otp', authController.verifyPasswordResetOTP);



module.exports = router;
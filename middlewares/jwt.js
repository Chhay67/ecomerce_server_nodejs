const {expressjwt: expjwt} = require('express-jwt');
const jwt = require('jsonwebtoken');
const { Token } = require('../models/token');

function authJwt() {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const API = process.env.API_PREFIX;
    return expjwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({ 
     path:[
          `${API}/login`,
          `${API}/login/`,

          `${API}/register`,
          `${API}/register/`,
         
          `${API}/forgot-password`,
          `${API}/forgot-password/`,
          `${API}/reset-password`,
          `${API}/reset-password/`,
          `${API}/verify-otp`,
          `${API}/verify-otp/`
     ]
    });
}

async function isRevoked(req, jwt, ) {
    const authHeader = req.header('Authorization');
    if( !authHeader.startsWith('Bearer ')) {
        return true; // No token provided
    }
    const accessToken = authHeader.replace('Bearer ', '').trim();
    const token = await Token.findOne({ accessToken });
    const adminRouteRexgex = /^\/api\/v1\/admin\//i;
     const adminFault = !jwt.payload.isAdmin && adminRouteRexgex.test(req.originalUrl);
     return adminFault || !token;
}    


module.exports = authJwt;
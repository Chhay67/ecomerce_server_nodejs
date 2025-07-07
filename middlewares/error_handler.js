const jwt = require('jsonwebtoken');
const { Token } = require('../models/token');
const { User } = require('../models/user');
async function errorHandler(error, req, res, next) {
     if (error.name === 'UnauthorizedError') {
          if (!error.message.includes('jwt expired')) {
               return res.status(error.status).json({ type: error.name, message: error.message });
          }
          try {
               const tokenHeader = req.headers['Authorization'];
               const accessToken = tokenHeader?.split(' ')[1];
               const token = await Token.findOne({ accessToken, refreshToken: { $exists: true, }, },);
               if (!token) {
                    return res.status(401).json({ type: 'Unauthorized', message: 'Token not found' });
               }
               const userData = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
               const user = await User.findById(userData.id);
               if (!user) {
                    return res.status(404).json({ message: 'User not found' });
               }
               const newAccessToken = jwt.sign({ id: user.userId, isAdmin: user.isAdmin },
                    process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
               req.headers['Authorization'] = `Bearer ${newAccessToken}`;

               await Token.updateOne({ _id: token._id }, { accessToken: newAccessToken }).exec();
               res.set('Authorization', `Bearer ${newAccessToken}`);
               return next();


          } catch (error) {
               console.error('Error during token verification:', error);
               return res.status(401).json({ type: 'Unauthorized', message: error.message });

          }

     }
     return res.status(404).json({ message: error.message });  
}

module.exports = errorHandler;
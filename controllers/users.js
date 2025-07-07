
const { User } = require('../models/user');

exports.getUsers = async (_, res) => {
     try {
          const users = await User.find().select('name email id isAdmin'); // Assuming User is a Mongoose model
          if (!users) {
               return res.status(404).send('No users found');
          }
          return res.status(200).json(users);

     } catch (error) {

          console.error('Error fetching users:', error);
          return res.status(500).json({ type: error.name, message: error.message });

     }
}

exports.getUserById = async (req, res) => {
     try {
          const user = await User.findById(req.params.id).select('-passwordHash -resetPasswordOtp -resetPasswordOtpExpires');
          if (!user) {
               return res.status(404).send('User not found');
          }
          return res.status(200).json(user);
     } catch (error) {
          console.error('Error fetching user by ID:', error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}

exports.updateUser = async (req, res) => {
     try {
          const { name, email, phone } = req.body;
          const user = await User.findByIdAndUpdate(req.params.id, { name, email, phone }, { new: true });
          if (!user) {
               return res.status(404).send('User not found');
          }
          return res.status(200).json({
               id: user.id,
               name: user.name,
               email: user.email,
               phone: user.phone,
               isAdmin: user.isAdmin,
          });
     } catch (error) {
          console.error('Error updating user:', error);
          return res.status(500).json({ type: error.name, message: error.message });

     }
}
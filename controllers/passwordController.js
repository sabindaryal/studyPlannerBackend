const nodemailer = require('nodemailer');
const otpGenerator = require('./utils/otpGenerate');
var db = require("../models");
const User = db.UserSignup;
const TokenVerifier = require('./utils/user_tokenVerify');
const bcrypt = require('bcrypt');

var otpdb = db.otp;

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email or active status
        const user = await User.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { email: email },
                    { activeStatus: true }
                ]
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate OTP
        const OTP = otpGenerator.generateOTP();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'bhattaraiashma76@gmail.com',
                pass: 'efuucrkujqeotxct'
            }
        });

        const mailOptions = {
            from: 'bhattaraiashma76@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${OTP}`
        };

        await transporter.sendMail(mailOptions);

        // Store OTP in database
        await otpdb.create({
            userId: user.user_Id,
            gmail: email,
            otp: OTP,
        });

        // Send success response
        res.status(200).json({ message: 'OTP sent successfully', data: { userId: user.user_Id, email: email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const verifyOtp = async (req, res) => {
    const { otp, userId } = req.body;

 
    if (!otp) {
        return res.status(400).json({ error: 'OTP is required' });
    }

    try {
        // Find OTP record in the database
        const otpRecord = await otpdb.findOne({
            where: {
                userId: userId,
                otp: otp
            }
        });

        // Check if OTP record exists
        if (!otpRecord) {
            return res.status(404).json({ error: 'Invalid OTP' });
        }

        // Calculate time difference between current time and OTP creation time
        const currentTime = new Date();
        const otpCreationTime = new Date(otpRecord.createdAt);
        const timeDifference = currentTime - otpCreationTime;

        // Set OTP expiry time (in milliseconds)
        const otpExpiryTime = 61000;

        // Check if OTP has expired
        if (timeDifference > otpExpiryTime) {
            // Remove expired OTP record from the database
            await otpRecord.destroy();
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // OTP verification successful
        return res.status(200).json({ data: userId, message: 'OTP verified' });
    } catch (error) {
        console.error(error);
        // Handle internal server error
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

      
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await TokenVerifier.clearToken(userId);
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const updatePassword = async (req, res) => {
    try {
       
        const { userId, oldPassword, newPassword } = req.body;


        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
  
        const token = req.headers.authorization.split(' ')[1];
  
        
            await TokenVerifier.verifyUserToken(userId, token);
      
        const user = await User.findByPk(userId);


        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }


        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        await TokenVerifier.clearToken(userId);
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const expireUser = async (req, res) => {
    try {
       
        const { userId } = req.body;


        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
  
        const token = req.headers.authorization.split(' ')[1];
  
        
            await TokenVerifier.verifyUserToken(userId, token);
      
  

     
        await TokenVerifier.clearToken(userId);
        return res.status(200).json({ message: 'Expired User Token  successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    forgotPassword, verifyOtp, resetPassword, updatePassword,expireUser

}





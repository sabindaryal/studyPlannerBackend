const bcrypt = require('bcrypt');
var db = require("../models");
var Userdb = db.UserSignup;
const jwt = require('jsonwebtoken');
const TokenVerifier = require('./utils/user_tokenVerify');
var UserDevice = db.UserDevice;

var SignupUser = async (req, res) => {
    let messages = {};
    try {
        const {
            displayName,
            email,
            password,
            role,
            device_token
        } = req.body;

        // Check if required fields are missing
        if (!displayName || !password) {
            return res.status(400).json({ error: 'Display name and password are required' });
        }

        // Check if user with the same email already exists
        const existingUser = await Userdb.findOne({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Create a new user
        const newUser = await Userdb.create({
            displayName,
            email,
            password,
            role: role || "student",
           
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.user_Id }, process.env.TOKENKEY, { expiresIn: '7d' });

        // Create user device info
        await UserDevice.create({
            user_Id: newUser.user_Id,
             device_token: device_token || 'thisisidevidetokennnn',
           
            user_token: token,
        });

        res.status(200).json({ message: 'User created successfully', user: newUser, token: token });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle Sequelize validation errors
            error.errors.forEach(element => {
                messages[element.path] = element.message; // Use the error message directly
            });
            res.status(400).json({ data: null, messages: messages });
        } else {
            // Handle other types of errors (e.g., database errors, server errors)
            console.error(error);
            res.status(500).json({ data: null, messages: 'Internal Server Error' });
        }
    }
}

module.exports = {
    SignupUser,
   
};

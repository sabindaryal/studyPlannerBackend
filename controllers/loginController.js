const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../models");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const User = db.UserSignup;
const UserDevice = db.UserDevice;

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { email: email },
                  
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user.user_Id }, process.env.TOKENKEY, { expiresIn: '7d' });

        let userInfo = await UserDevice.findOne({ where: { user_Id: user.user_Id } });

        if (!userInfo) {
            userInfo = await UserDevice.create({
                user_Id: user.user_Id,


                user_token: token
            });
        } else {
            await userInfo.update({
                user_Id: user.user_Id,

                user_token: token
            });
        }

        res.status(200).json({ message: 'Login successful', token: token, user: user, userInfo: userInfo });
    } catch (error) {
        console.error('Login error:', error);

        if (error.name === 'SequelizeValidationError') {
            const messages = {};
            error.errors.forEach(element => {
                messages[element.path] = element.message;
            });
            return res.status(400).json({ error: 'Validation error', messages: messages });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    loginUser,
};

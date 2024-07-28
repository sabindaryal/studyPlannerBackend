var db = require('../../models');
var UserDevice = db.UserDevice;
const TokenVerifier = require('./tokenVerify');

class UserTokenVerify {

    // Static method to verify user token
    static verifyUserToken = async (user_Id, token) => {
        try {
            // Fetch user device info from database
            const userDeviceInfo = await UserDevice.findOne({ where: { user_Id: user_Id } });
            
            if (!userDeviceInfo) {
                return { status: 401, message: 'Unauthorized' };
            }

            // Get saved token from user device info
            const savedToken = userDeviceInfo.user_token;
            console.log("savedToken", savedToken);

            // Verify if the token is valid
            const isValidToken = await TokenVerifier.verifyToken(token);

            // Check if token is invalid or does not match saved token
            if (!isValidToken || token !== savedToken) {
                return { status: 401, message: 'Unauthorized' };
            }

            // If token is valid
            return { status: 200, message: 'Token is valid' };
        } catch (error) {
            console.error(`Error verifying token for user_Id ${user_Id}:`, error);
            return { status: 500, message: 'Token verification failed' };
        }
    };

    // Static method to clear tokens
    static clearToken = async (user_id) => {
        // Validate user_id
        if (!user_id) {
            return { status: 400, message: 'User ID is required' };
        }

        try {
            // Check if user exists before clearing tokens
            const user = await UserDevice.findByPk(user_id);
            if (!user) {
                return { status: 404, message: 'User not found' };
            }

            // Clear tokens associated with the user
            await UserDevice.destroy({
                where: {
                    user_Id: user_id
                }
            });

            console.log(`Tokens cleared for user_id: ${user_id}`);
            return { status: 200, message: 'Tokens cleared successfully' };
        } catch (error) {
            console.error(`Error clearing tokens for user_id ${user_id}:`, error);
            return { status: 500, message: 'Token clearance failed' };
        }
    };
}

module.exports = UserTokenVerify;

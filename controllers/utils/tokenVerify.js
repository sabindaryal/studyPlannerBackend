
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })



class TokenVerifier {
  static verifyToken(token, student_id,res) {

    return new Promise((resolve, reject) => {
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      jwt.verify(token, process.env.TOKENKEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }


        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        resolve(decoded);
      });
    });
  }




  static expireToken(token) {
    try {
      // Decode the token to get its payload
      const decoded = jwt.decode(token, { complete: true });

      // Ensure that the token has not already expired
      if (decoded && decoded.payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiredToken = {
          ...decoded.payload,
          exp: currentTime - 1 // Set expiry time to a past time
        };

        // Sign the updated token with the same secret key
        const newToken = jwt.sign(expiredToken, process.env.JWT_SECRET);

        // At this point, you may update the token in your application's context
        // For example, update the token in your database or cache

        return newToken;
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

}




module.exports = TokenVerifier;


require("dotenv").config();

const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const tokenReceived = req.headers.authorization.split(" ")[1].trim();
    try{
        jwt.verify(tokenReceived, secretKey);
        next()
    }catch(err){
        res.status(404).json({
            msg:"Error in user token check",
            err:err.message
        })
    }
}

module.exports = userMiddleware;
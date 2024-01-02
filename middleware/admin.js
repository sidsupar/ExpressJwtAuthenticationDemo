require("dotenv").config()
const jwt = require("jsonwebtoken");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB.
  let tokenReceived = req.headers.authorization;
  tokenReceived = tokenReceived.split(" ")[1].trim();
//   console.log(`tokenReceived = ${tokenReceived}`);
//   console.log(`payload = `);
//   console.log(jwt.decode(tokenReceived));
  let payload = null;
  try{
    // console.log(`secretKey = ${process.env.secretKey}`)
    payload = jwt.verify(tokenReceived, process.env.secretKey);
    next()
  }catch(err){
    console.log(`error authenticating admin jwt token : ${err}`)
    res.status(404).json({
        msg:"Invalid authorization token"
    })
  }

}

module.exports = adminMiddleware;

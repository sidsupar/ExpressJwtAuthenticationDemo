const {User} = require("../db/index");


async function userRedundancy(req, res, next){
    try{
        const userCheck = await User.findOne({
            username: req.body.username
        });
        if(userCheck){
            throw new Error(`User already exists with same username`);
        }
        next();
    }catch(err){
        res.status(404).json({
            msg:err.message
        });
    }
}
module.exports.userRedundancy = userRedundancy
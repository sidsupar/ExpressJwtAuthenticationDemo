const {Admin} =  require("../db");

async function checkAdminAlreadyExistsOrNot(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    try{
        const adminCheck = await Admin.findOne({
            username: username,
        })
        if(adminCheck){
            res.status(404).json({
                msg:"Admin already exists"
            })
            return
        }else{
            next();
        }
    }catch(err){
        res.status(404).json({
            msg:"Error in admin redundacny check"
        })
    }
}

module.exports.adminRedundancyCheck = checkAdminAlreadyExistsOrNot
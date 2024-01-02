const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {userRedundancy} = require("../middleware/userRedundancyCheck");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");

require("dotenv").config();



// User Routes
router.post('/signup', userRedundancy,async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = new User();
        user.username = username;
        user.password = password;
        res.status(201).json(
            {
                msg:"User created successfully"
            }
        )
        await user.save();
    }catch(err){
        console.log(err)
        res.status(404).json(
            {
                msg:"Error registering user",
                err:err.message,
            }
        )
    }

});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    /*
    POST /users/signin
  Description: Logs in a user account.
  Input: { username: 'user', password: 'pass' }
  Output: { token: 'your-token' }
    */
    const username = req.headers.username;
    const password = req.headers.password;

    try{
        const user = await User.findOne({
            username: username,
            password: password
        })
        console.log(user);
        if(user){
            const jwtToken = jwt.sign({username},process.env.secretKey);
            res.status(200).json({
                msg:"Sigend in successfully",
                token: jwtToken
            })
        }else{
            throw new Error("Invalid username or password");
        }

    }catch(err){
        res.status(404).json({
            msg:"Error finding user in DB",
            err:err.message
        })
    }


});

router.get('/courses', userMiddleware ,async (req, res) => {
    // Implement listing all courses logic
    try{
        const courses = await Course.find();
        if(courses.length > 0){
            res.status(200).json({
                courses
            })
        }
    }catch(err){
        res.status(404).json({
            msg:"Error fetching all the courses",
            err:err.message
        })
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    try{
        const tokenReceived = req.headers.authorization.split(" ")[1].trim();
        const username = jwt.decode(tokenReceived, process.env.secretKey).username;
        const courseId = req.params.courseId;
        try{    
            const course = await Course.find({
                _id: courseId
            })
            if(course.length < 1){
                throw new Error("Course not found in DB")
            }
            await User.updateOne(
                {
                    username
                },
                {
                    $push:{purchasedCourses:courseId}
                }
            );
            res.status(200).json({
                msg:"Course purchased successfully"
            })
        }catch(err){
            res.status(404).json({
                msg:err.message
            })
        }

    }catch(err){
        res.status(404).json({
            msg:"Error purchasing course",
            err:err.message
        })
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try{
        const tokenReceived = req.headers.authorization.split(" ")[1].trim();
        const username = jwt.decode(tokenReceived, process.env.secretKey).username;
        console.log(username)
        let user = await User.findOne({
            username: username
        })
        if(!user){
            throw new Error("User not found in DB while fetching user courses");
        }

        user = await user.populate("purchasedCourses");
        // console.log(user)
        res.status(200).json({
            msg:"Success",
            courses:user.purchasedCourses
        })


    }catch(err){
        console.log(err)
        res.status(404).json({
            msg: err.message
        })
    }
});

module.exports = router
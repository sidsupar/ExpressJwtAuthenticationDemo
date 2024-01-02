const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const {adminRedundancyCheck} = require("../middleware/adminRedundancyCheck");
const jwt = require("jsonwebtoken")
require('dotenv').config()

// Admin Routes
router.post('/signup', adminRedundancyCheck,(req, res) => {
    // Implement admin signup logic

    const username = req.body.username;
    const password = req.body.password;

    const adminUser = new Admin();
    adminUser.username = username;
    adminUser.password = password;

    try{
        adminUser.save();
        res.status(200).json({
            msg:"A new admin has been successfully added to the Admin DB"
        });
    }catch(err){
        res.status(404).json({
            msg:"Error adding admin to the DB"
        });
    }
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;

    try{
        const admin = await Admin.findOne({
            username: username,
            password: password
        })
        if(admin){
            let jwtToken = jwt.sign({username},process.env.secretKey)
            res.status(201).json({
                msg:"Authorized",
                token:jwtToken
            })
        }else{
            res.status(404).json({
                msg:"Wrong admin credentials"
            })
        }
    }catch(err){
        res.status(404).json({
            msg:"Error finding admin in DB"
        })
    }
});

router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
    /*
      Description: Creates a new course.
  Input: Headers: { 'Authorization': 'Bearer <your-token>' },
  Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com' }
  Output: { message: 'Course created successfully', courseId: "new course id" }
    */
  let tokenReceived = req.headers.authorization;
  tokenReceived = tokenReceived.split(" ")[1];
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;
  const payload = jwt.decode(tokenReceived)
  const adminName = payload.username;
  try{

    const adminCheck = await Admin.findOne({
        username: adminName
    })
    if(adminCheck){
        const courseToAdd = {
            title:title,
            description:description,
            price:price,
            imageLink:imageLink
        }
        const course = new Course(courseToAdd);
        await course.save();
        res.status(200).json({
            msg:"Course added successfully",
            addedBy:adminName
        })
    }else{
        res.status(404).json({
            msg:"Admin not found"
        })
    }

  } catch(err) {
    res.status(404).json({
        msg:"Error adding course to Course DB"
    })
  }

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find();
    if(courses.length > 0) {
        res.status(200).json({
            courses
        })
    }else{
        res.status(404).json({
            msg:"No courses found"
        })
    }

});

module.exports = router;
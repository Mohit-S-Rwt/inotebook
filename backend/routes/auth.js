const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "mohitisagoodb$oy";

// Route 1 : create a user

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be of 5 characters").isLength({ min: 5 }),
  ],
 async (req, res) => {
  let success= false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success,errors:errors.array()});
    }
    // check whether user with the same email exists
    try {
      
    let user = await User.findOne({email:req.body.email})
    if (user){
      return res.status(400).json({success,error:"Sorry a user with this emailo already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password,salt)
    // create a new user
    user = await User.create({
      name:req.body.name,
      password:secPassword,
      email:req.body.email,
      
    });
    const data = {
      user:{
        id : user.id
      }
       
    }
    // .then (user=>res.json(user))
    // res.send(req.body)
      // .catch(err => {console.log(err)
      // res.json({error:"please enter a unique value for email", message:err.message})})
    const authtoken =  jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success, authtoken})
    } catch (error) {
   console.error(error.message);
   res.staus(500).send("Internal error occured")
    }
  } );
  
// Route 2: user logged in

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare){
        success=false
      
        return res
          .status(400)
          .json({ success ,error: "please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success,authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// Route 3 : get loggedin user details
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

module.exports = router;

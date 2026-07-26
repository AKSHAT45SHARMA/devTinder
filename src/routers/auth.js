const express = require("express");
const authRouter = express.Router();
const User = require('../models/users');
const {validation} = require('../utility/validation');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");

authRouter.use(cookieParser());

authRouter.post('/login', async(req,res)=>{
    const {email, password} = req.body;


    try{
        if(!email || !password){
            throw new Error("please provide email and password");
        }else if(!validator.isEmail(email)){
            throw new Error("please provide a correct email");
        }
        const user = await User.findOne({email : email});
        if(!user){
            throw new Error("invlaid credentials");
        }
        const isPasswordMatch = await user.validateUser(password);
        if(!isPasswordMatch){
            throw new Error("invlaid credentials");
        }
        const token = await user.jwtsign();
        res.cookie("token",token);
        res.send( user);
    }catch(err){
        res.status(400).send("something went wrong in Login:" + err);
    }
});

authRouter.post('/signup', async(req,res)=>{
    // const user = new User({
    //     firstName : 'Aksaht',
    //     lastName  : 'Sharma'
    // })
    // try{
    // await user.save();
    // res.send("user save successfully");
    // }catch(err){
    //     res.status(404).send(err);
    // }


    // for encrypting the password we can use bcrypt library and for generating token we can use jsonwebtoken library but here i am just validating the credentials and saving the user in database without encrypting the password and generating token for simplicity.
     
    try{
    //1- validation the credentials
    validation(req);

    // 2- encrpt the password
    const {password} = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);


    // 3- save the data...
    const {firstName, lastName , email,gender,age} = req.body;
    const user = new User({
        firstName,
        lastName,
        email,
        age,
        gender,
        password : passwordHashed
    });
    
    const savedUser =await user.save();
    const token = await user.jwtsign();
    res.cookie("token",token);
    res.send(savedUser);
    }catch(err){
        res.status(404).send("Error in saving user: " + err);
    }

});

authRouter.post("/logout",(req,res)=>{
    res.cookie('token',null,{expires : new Date(Date.now())});
    res.send("logout successfully");
})


module.exports = authRouter;
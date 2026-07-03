const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

const User = require('../models/users');
const userAuth = require("../utility/middleware/auth");
const {validateEditProfileData} = require("../utility/validation");

profileRouter.get("/profile/view",userAuth,(req,res)=>{
    const user = req.user;
    try{
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR: ");
    }
    
});

profileRouter.post("/profile/edit", userAuth, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("not allowed certain field");
        }

        const loggedinUser = req.user;
        Object.keys(req.body).every((key)=>loggedinUser[key]=req.body[key]);
        await loggedinUser.save();
        res.json({data:loggedinUser});

    }catch(err){
        res.status(404).send("Error: "+err);
    }
});

profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try{
        const logginUser = req.user;

        if(await bcrypt.compare(req.body.password,logginUser.password)){
            throw new Error("cann't be a same password");
        }
        const password = await bcrypt.hash(req.body.password,10);

        logginUser.password = password;
        await logginUser.save();

        res.json({
            "message" : `${logginUser.firstName}`+" is change its password",
        "password" : req.body.password});

    }catch(err){
        res.status(404).send("Error: "+err);
    }
});

module.exports = profileRouter;
const express = require("express");
const userRouter = express.Router();
const userAuth = require("../utility/middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/users');

const userData = "firstName lastName photoUrl about age skills";

userRouter.get("/user/request/recieved", userAuth , async (req,res)=>{
    const logginUser = req.user;

    try{
        const requests = await ConnectionRequest.find({
            toUserId : logginUser._id,
            status : "interested"
        }).populate("fromUserId",userData);

        res.send(requests);
    }catch(err){
        res.status(404).send("Error : "+err.message);
    }
})

userRouter.get("/user/connection",userAuth,async(req,res)=>{
    const logginUser = req.user;

    try{
        const connection = await ConnectionRequest.find({
            $or :[
                {toUserId : logginUser._id, status : "accepted"},
                {fromUserId : logginUser._id , status : "accepted"}
            ]
        }).populate("fromUserId",userData).populate("toUserId",userData);
        if(connection.length === 0) throw new Error("NO data found");

        const data = connection.map((document)=>{
           if(document.fromUserId._id.toString() === logginUser._id.toString()){
             return document.toUserId;
           }
           return document.fromUserId;
        })
        res.send(data);
    }catch(err){
        res.status(500).send("Error: "+err.message);
    }
});

userRouter.get("/feed", userAuth, async(req,res)=>{
    const logginUser = req.user;

    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;

        const skip = (page-1)*limit;

        const hideUser = await ConnectionRequest.find({
            $or : [
                {toUserId : logginUser._id},
                {fromUserId : logginUser._id}
            ]
        },{toUserId : 1, fromUserId:1});

        const hideUserArray = new Set();

        hideUser.forEach((req)=>{
            hideUserArray.add(req.toUserId.toString());
            hideUserArray.add(req.fromUserId.toString());
        });

        const availableUser = await User.find({
            _id : {$nin : Array.from(hideUserArray)}
        }).select(userData)
        .skip(skip)
        .limit(limit);

        res.send(availableUser);
    }catch(err){
        res.status(500).send("Error: "+err.message);
    }
});

module.exports = userRouter;
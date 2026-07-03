const express = require("express");
const requestRouter = express.Router();
const User = require('../models/users');
const userAuth = require("../utility/middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;

        const user = await User.findById(toUserId);

        if(!user){
            throw new Error("NO user Found");
        }

        const allowed = ["interested","ignored"];

        if(!allowed.includes(status)){
            throw new Error("incoorect Information");
        }

        const existConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        });

        if(existConnectionRequest){
            throw new Error("connection Request already sent");
        }

        if(toUserId === fromUserId.toString()){
            throw new Error("Cant send Connection Request");
        }

        const connectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({"message" : "Your data is registered"});
    }catch(err){
        res.status(404).send("Error: "+ err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    const {status,requestId} = req.params;

    try{
        const allowed = ["accepted","rejected"];

        if(!allowed.includes(status)){
            throw new Error("wrong status code");
        }

        const connectionRequest = await ConnectionRequest.findOne({
        fromUserId : requestId,
        toUserId : req.user._id,
        status : "interested"
        });

        if(!connectionRequest){
            throw new Error("Request Not found");
        }
        connectionRequest.status = status;
        await connectionRequest.save()
        res.send(connectionRequest);
    }catch(err){
        res.status(404).json({"Error: " : err.message});
    }

})

module.exports = requestRouter;
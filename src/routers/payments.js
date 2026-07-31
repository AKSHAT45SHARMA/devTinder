const express = require("express");
const instance = require("../utility/razorpay");
const userAuth = require("../utility/middleware/auth");
const Payment = require("../models/payment");
const membershipTypePrice = require("../utility/constant");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
    const {membershipType} = req.body;
    const {firstName} = req.user;
    try{
        const order = await instance.orders.create({
            amount : membershipTypePrice[membershipType]*100,
            currency : "INR",
            receipt : "receipt@1",
            notes:{
                FirstName : firstName,
                MembershipType : membershipType
            }
        });

        const {id,amount,receipt,currency,notes,status} = order;

        const payment = new Payment({
            userId : req.user._id,
            orderId : id,
            amount : amount,
            currency : currency,
            notes : notes,
            receipt : receipt,
            status : status
        });

        const savedPayment = await payment.save();
        res.send(order);
    }catch(err){
        res.send(err);
    }
});

module.exports = paymentRouter;
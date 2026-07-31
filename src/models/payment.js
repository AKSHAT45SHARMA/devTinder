const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Types.ObjectId,
        ref : "users",
        required : true
    },
    paymentId : {
        type : "string",
    },
    orderId : {
        type : "string",
        required : true
    },
    status : {
        type : "string",
        required : true
    },
    reciept : {
        type : "string",
        required : true
    },
    amount : {
        type : "string",
        required : true
    },
    currency : {
        type : "string",
        required : true
    },
    notes : {
        FirstName : {
            type : "string"
        },
        MembershipType : {
            type : "string"
        }
    }

},{timestamps : true});

const paym = mongoose.model("Payment" , paymentSchema);

module.exports = paym;
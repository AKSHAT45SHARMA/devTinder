const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : {
            values : ["rejected","ignored","accepted","interested"],
            message : `{VALUE} is not present`
        },
        required : true
    }
},
{
    timestamps : true
}
);

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

const ConnectionRequests = new mongoose.model("ConnectionRequests",connectionRequestSchema);

module.exports = ConnectionRequests;
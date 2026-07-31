const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        trim :true,
        required : true,
        maxLength : 20
    },
    lastName : {
        type : String,
        trim :true,
        maxLength : 20
    },
    email : {
        type : String,
        trim :true,
        required : true,
        lowercase : true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        },
        unique : true
    },
    password : {
        type : String,
        trim :true,
        required : true,
        // validator(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("Password is not strong enough");
        //     }
        // }
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        enum : ["male","female","other"],
        trim : true,
        lowercase : true,
    },
    photoUrl :{
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("invalid url");
            }
        }
    },
    about : {
        type : String,
        trim :true,
        default : "Hey there I am using DevTinder",
        maxLength : 200
    },
    skills : {
        type : [String],
        validate(value){
            if(value.forEach((skill)=>{
                if(skill.length > 20){
                    throw new Error("skill length should not be more than 20");
                }
            }))
            if(value.length > 5){
                throw new Error("skills should not be more then 5");
            }
        },
        trim :true,
    }
    
},{
    timestamps : true
});

userSchema.methods.jwtsign = async function(){
    const user = this;

    const token = await jwt.sign({_id : user.id},process.env.JWT_SECRET);
    return token;
}

userSchema.methods.validateUser = async function(password){
    const user = this;

    const isValidUser = await bcrypt.compare(password , user.password);

    return isValidUser;
}



const User = mongoose.model('User', userSchema);
module.exports = User;
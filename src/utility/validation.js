const validator = require("validator");

const validation = (req) =>{
    const {email,password} = req.body;

    if(!email || !password){
        throw new Error ("Email and password in not provided");
    }else if(!validator.isEmail(email)){
        throw new Error("invalid email");
    }
};


const validateEditProfileData = (req)=>{
    const allowedField = ["firstName","lastName","photoUrl","age","gender","about","skills"];

    const isEditAllowed = Object.keys(req.body).every(field=>allowedField.includes(field));

    return isEditAllowed;
}

module.exports = {validation,validateEditProfileData};
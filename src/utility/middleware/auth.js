const jwt = require('jsonwebtoken');
const User = require('../../models/users');

const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;

    try{
        if(!token){
            return res.status(401).send("Invalid credentials");
        }
        const decodedObj = await jwt.verify(token,"mysecretkey");
        const user= await User.findOne({_id : decodedObj._id});
        if(!user){
            throw new Error("Invalid Credentials....");
        }
        req.user = user;
        next();
    }catch(err){
        res.send("ERROR HOON : "+err.message);
    }
}

module.exports = userAuth;
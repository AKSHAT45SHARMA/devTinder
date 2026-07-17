const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const userAuth = require("./utility/middleware/auth");
const cors = require("cors");

const app = express();
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require('./routers/user');

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));
app.use(express.json());
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

app.get('/user',async(req,res)=>{
    const userEmail = req.body.email;
    console.log(userEmail);
    try{
        const users = await User.find({email : userEmail});
        if(users.length === 0){
            return res.status(404).send("user not found");
        }
        res.send(users);
    }catch{
        res.send("Error in fetching data from database");
    }
});

app.delete('/deleteUser',async(req,res)=>{
    const user = req.body.email;
    try{
        const deletedUser = await User.findOneAndDelete({email : user});
        if(!deletedUser){
            return res.status(404).send("user not found");
        }
        res.send("user deleted successfully");
    }catch(err){
        res.status(404).send("Error while deleting user:"+ err);
    }
});

app.patch('/updateUser/:id',async(req,res)=>{
    const userID = req.params?.id;
    const data = req.body;
    
    try{
        const allowedUpdates = ['firstName','lastName','email','password','age','gender','photoUrl','about','skills'];
        const updates = Object.keys(data).every((update)=>allowedUpdates.includes(update));

    if(!updates){
        throw new Error("update not allowed");
    }
        const updatedUser = await User.findByIdAndUpdate(userID,data,{returnDocument : 'after',runValidators : true});
        if(!updatedUser){
            throw new Error("user not found");
        }
        res.send(updatedUser);
    }catch(err){
        res.status(404).send("error while updating error "+ err);
    }
})



app.get('/feed',userAuth,async(req,res)=>{
    try{
        
        const users = await User.find();
        res.send(users);
    }catch{
        res.send("Error in fetching data from databse");
    }
}); 




connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.log("Error connecting to databases: ", err);
});



const mongoose = require('mongoose');

const connectDB = async() => {
    await(mongoose.connect("mongodb://akshat:akshat@ac-q9qzryp-shard-00-00.swt6axq.mongodb.net:27017,ac-q9qzryp-shard-00-01.swt6axq.mongodb.net:27017,ac-q9qzryp-shard-00-02.swt6axq.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-11sel4-shard-0&authSource=admin&appName=Cluster0"))
}

module.exports = connectDB;
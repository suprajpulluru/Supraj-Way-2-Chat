const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }
    catch(error) {
        console.log("MongoDB Connection Error!");
        console.log(error.message.red.bold);
    }
}
module.exports = connectDB;
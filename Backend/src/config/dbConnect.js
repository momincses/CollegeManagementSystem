const mongoose = require("mongoose")

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        // console.log(`Database connected : ${connect.connection.host}, ${connect.connection.name}`);
        console.log(`Database connected :${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.log('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = dbConnect;
const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        // Ensure MONGO_URI starts with mongodb:// or mongodb+srv://
        if (!process.env.MONGO_URI?.startsWith('mongodb://') && !process.env.MONGO_URI?.startsWith('mongodb+srv://')) {
            throw new Error('Invalid MongoDB connection string format');
        }

        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected : ${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.log('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = dbConnect;
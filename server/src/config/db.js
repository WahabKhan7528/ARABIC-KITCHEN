const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[arabic-kitchen] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[arabic-kitchen] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

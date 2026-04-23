const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood-donation';
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Make sure MongoDB is running locally or your Atlas IP is whitelisted.');
    console.error('Retrying connection in 5 seconds...');
    
    // Retry once after 5 seconds instead of crashing
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const conn = await mongoose.connect(mongoURI, options);
          console.log(`MongoDB Connected on retry: ${conn.connection.host}`);
          resolve(conn);
        } catch (retryError) {
          console.error('MongoDB connection failed after retry. Server will continue running.');
          console.error('API calls requiring database will fail until connection is restored.');
          resolve(null);
        }
      }, 5000);
    });
  }
};

module.exports = connectDB;

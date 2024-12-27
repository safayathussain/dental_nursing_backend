require("dotenv").config();
const mongoose = require("mongoose");

// create a connect
const uri = process.env.MONGODB_URI;
const connectWithDB = async () => {
  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds for server selection
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
    });
    console.log("Connected to Database");
    return db;
  } catch (e) {
    console.error("Failed to connect to the database. Exiting now...");
    console.error(e.message);
    process.exit(1);
  }
};

const disconnectFromDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from Database");
  } catch (e) {
    console.error("Error disconnecting from the database:", e.message);
  }
};


// export them
module.exports = {
  connectWithDB,
  disconnectFromDB,
};

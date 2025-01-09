const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const Notification = require("./src/modules/Notification/model");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;

// Initialize the socket.io server
const server = http.createServer(app);
const socketServer = socketIo(server, { cors: { origin: "*" } });

// Store user ObjectIds associated with sockets
const userSocketMap = {};

// Server listening on the specified port
server.listen(PORT, () => {
  console.log("Server running on port => " + PORT);
});

// Send Notification to specific user
const sendNotification = async (sendTo, sendBy, content, link) => {
  const recipientSocketId = userSocketMap[sendTo];

  if (recipientSocketId) {
    // Create a notification in the database
    const notification = await Notification.create({
      sendBy,
      sendTo,
      content,
      link,
    });

    // Emit the notification to the user
    socketServer
      .to(recipientSocketId)
      .emit("notification", notification.toObject());
  } else {
    console.log(`User with ID ${sendTo} is not connected.`);
  }
};

// Socket event handling
socketServer.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user by their ObjectId
  socket.on("register", (userId) => {
    userSocketMap[userId ] = socket.id;  // Store userId as string for consistency
    console.log("User registered:", userId);
  });

  // Handle sending notifications
  socket.on("sendNotification", (data) => {
    // Call the sendNotification function with ObjectIds
    sendNotification(data.sendTo, data.sendBy, data.content, data.link);
  });

  // Clean up when a user disconnects
  socket.on("disconnect", () => {
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId]; // Remove the socket from the map
        console.log("User disconnected:", userId);
      }
    }
  });
});

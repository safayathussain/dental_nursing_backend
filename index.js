const app = require("./app");
const server = require("http").createServer(app);
const socket = require("socket.io");
const activeSockets = {};
const PORT = process.env.PORT || 8080;

// Initialize the socket.io server
const socketServer = socket(server, { cors: { origin: "*" } });

server.listen(PORT, function () {
  console.log("Server running on port => " + PORT);
});

// Socket event handling
socketServer.on("connection", (socket) => {
  

  socket.on("disconnect", () => {
    // console.log("Disconnected");
    // Clean up the socket when it disconnects
    delete activeSockets[socket.id];
  });
});
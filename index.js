const app = require('./app');
const server = require('http').createServer(app);

const PORT = process.env.PORT || 8080;

// const client = io('http://localhost:8080');

server.listen(PORT, function () {
  console.log('Server running on port => ' + PORT);


});

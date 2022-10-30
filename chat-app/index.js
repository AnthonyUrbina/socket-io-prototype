/* eslint-disable no-console */
// const express = require('express');
// const path = require('node:path');
// const app = express();
// const http = require('http');

// const { Server } = require('socket.io');
// const io = new Server(http);

// const staticMiddleWare = express.static(publicPath);
// app.use(staticMiddleWare);

// // app.get('/', (req, res) => {
// //   res.send('<h1>Hello world</h1>');
// // });

// app.listen(3000, () => {
//   console.log('listening on port 3000');
// });

const express = require('express');
const path = require('node:path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const publicPath = path.join(__dirname, 'public/index.html');

app.get('/', (req, res) => {
  res.sendFile(publicPath);
});

io.on('connection', socket => {
  console.log('a user connected');
  io.emit('greeting', 'has entered the chat');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
server.listen(3000, () => {
  console.log('listening on port 3000');
});

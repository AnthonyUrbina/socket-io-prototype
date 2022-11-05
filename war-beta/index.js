/* eslint-disable no-console */
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('node:path');
const publicPath = path.join(__dirname, 'dist');
const staticMiddleware = express.static(publicPath);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(staticMiddleware);

app.get('/', (req, res) => {
  res.send();
});

io.on('connection', socket => {
  console.log('a user has connected');
  socket.on('player 1 card flipped', card => {
    console.log(card);
    io.emit('player 1 card flipped response', card);
  });
  socket.on('player 2 card flipped', card => {
    io.emit('player 2 card flipped response', card);
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

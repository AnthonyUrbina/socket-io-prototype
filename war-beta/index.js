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
  socket.on('message', msg => {
    console.log(msg);
    io.emit('message response', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('src'))
server.listen(port, () => {
  console.log('listening on PORT', port)
});


let users = [];

const addUser = socket => {
  users.push(socket.id)
  console.log('users are: ', users);
}

const removeUser = socket => {
  users = users.filter(user => user !== socket.id);
  console.log(`socket id ${socket.id} is removed.`);
};

io.on('connection', socket => {
  console.log('new user connected ...');
  addUser(socket);
  
  socket.on('disconnect', () => {
    removeUser(socket);
  });
})


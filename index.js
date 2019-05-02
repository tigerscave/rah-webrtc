const express = require('express');
const app = express();
const port = process.env.PORT || 3100;
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

const handleReloadUsers = socket => {
  socket.emit('userList', users)
};

const handleOfferFromSender = (socket, data) => {
  const { description, userId } = data;
  socket.to(userId).emit('offerToReceiver', {
    description,
    senderId: socket.id
  })
};

const handleAnswerFromReceiver = (socket, data) => {
  const { userId, description } = data;
  socket.to(userId).emit('answerToSender', description)
}

io.on('connection', socket => {
  console.log('new user connected ...');
  addUser(socket);
  
  socket.on('disconnect', () => {
    removeUser(socket);
  });
  
  socket.on('reloadUsers', () => {
    handleReloadUsers(socket)
  })
  
  socket.on('offerFromSender', data => {
    handleOfferFromSender(socket, data)
  })
  
  socket.on('answerFromReceiver', data => {
    handleAnswerFromReceiver(socket, data)
  })
})


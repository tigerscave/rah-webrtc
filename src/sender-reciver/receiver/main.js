'use strict';

const socket = io();

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
});

socket.on('offerToReceiver', data => {
  const { description, senderId } = data;
  
})

'use strict'
const socket = io();

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
});

let localStream;
const localVideo = document.getElementById('localVideo');
const mediaDevice = {
  video: true,
  audio: false,
}

const handleLocalMediaStream = mediaStream => {
  localVideo.srcObject = mediaStream
  localStream = mediaStream
}

const onClickedStartButton = () => {
  navigator.mediaDevices.getUserMedia(mediaDevice)
    .then(handleLocalMediaStream)
    .catch(() => {
      alert('Error: cannot load media stream')
    })
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', onClickedStartButton);

const userList = document.getElementById("userList");

const onClickedReloadButton = () => {
  console.log('reload button clicked')
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  };
  socket.emit('reloadUsers');
}

socket.on('userList', users => {
  console.log('user from sender', users)
  const otherUsers = users.filter(id => id !== socket.id);
  
  otherUsers.map(id => {
    const listNode = document.createElement('LI');
    const textNode = document.createTextNode(id);
    listNode.appendChild(textNode);
  
    userList.appendChild(listNode)
  })
})

const reloadButton = document.getElementById('reloadButton')
reloadButton.addEventListener('click', onClickedReloadButton)

'use strict';

const socket = io();

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
});

let pc = new RTCPeerConnection();

const handleIceCandidate = event => {
  const { condidate } = event;
  if (condidate) {
    console.log('---handleOnLocalIceCandidate---')
    const newIceCondidate = new RTCIceCandidate(condidate);
    pc.addIceCandidate(newIceCondidate);
  }
};

const handleOnTrackConnection = event => {
  console.log("---handleOnTrackConnection---", event);
  const remoteVideo = document.getElementById('remoteVideo')
  remoteVideo.srcObject = event.stream[0];
};

const handleMessageReceived = event => {
  const { data } = event;
}

const handleDataChannel = event => {
  const { channel } = event;
  channel.addEventListener('message', handleMessageReceived);
}

const createAnswer = (senderId, description) => {
  pc.addEventListener('icecandidate', handleIceCandidate);
  
  pc.setLocalDescription(description).then(() => {
    pc.addEventListener('track', handleOnTrackConnection);
    pc.addEventListener('dataChannel', handleDataChannel);
    
    socket.emit('answerFromReceiver', {
      description,
      senderId
    })
    
    console.log("pc", pc.connectionState)
  })
}

socket.on('offerToReceiver', data => {
  const { description, senderId } = data;
  pc.setRemoteDescription(description)
    .then(() => {
      pc.createAnswer()
        .then(description => createAnswer(senderId, description))
    })
})


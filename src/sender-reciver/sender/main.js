'use strict'
const socket = io();

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
});

let localStream;
let pc;
const localVideo = document.getElementById('localVideo');
const mediaDevice = {
  video: true,
  audio: false,
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

const handleLocalMediaStream = mediaStream => {
  localVideo.srcObject = mediaStream
  localStream = mediaStream;
  
  pc = new RTCPeerConnection();
  pc.createDataChannel('dataChannel', null)
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

const createOfferSuccess = (id, description) => {
  pc.setLocalDescription(description)
    .then(() => {
      socket.emit('offerFromSender', {
        description,
        userId: id,
      })
    });
};

const onClickedCallButton = id => {
  console.log('userId', id)
  pc.createOffer(offerOptions)
    .then((description) => createOfferSuccess(id, description))
}

socket.on('userList', users => {
  console.log('user from sender', users)
  const otherUsers = users.filter(id => id !== socket.id);
  
  otherUsers.map(id => {
    const listNode = document.createElement('LI');
    const textNode = document.createTextNode(id);
    listNode.appendChild(textNode);
    
    const callButton = document.createElement('BUTTON');
    const callButtonText = document.createTextNode('CALL')
    callButton.appendChild(callButtonText);
    callButton.value = id;
    callButton.addEventListener('click', () => onClickedCallButton(id))
    listNode.appendChild(callButton);
    
    userList.appendChild(listNode)
  })
})

const reloadButton = document.getElementById('reloadButton')
reloadButton.addEventListener('click', onClickedReloadButton)

const handleIceCandidate = event => {
  const { candidate } = event;
  
  if (candidate) {
    const newIceCandidate = new RTCIceCandidate(candidate);
    pc.addIceCandidate(newIceCandidate);
  }
}

socket.on('answerToSender', description => {
  pc.addEventListener('icecandidate', handleIceCandidate);
  pc.setRemoteDescription(description).then(() => {
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
    console.log('pc connectionState', pc.connectionState)
  })
})

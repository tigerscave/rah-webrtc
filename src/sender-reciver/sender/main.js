'use strict'
const socket = io();

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
});

let localStream;
let pc;
let dataChannel = null;   // for WebRTC data channel
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
  dataChannel = pc.createDataChannel('hogeData')
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
  console.log('createOffer', id, description)
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

const onHogeButtonClicked = () => {
  console.log("hoge")
  dataChannel.send('turn-on');
  console.log(dataChannel)
}

const hogeButton = document.getElementById('hogeButton');
hogeButton.addEventListener('click', onHogeButtonClicked);

const onClickedHangUpButton = () => {
  console.log('hangup clicked')
  dataChannel.send('turn-off');
}

const hangUpButton = document.getElementById('hangUpButton');
hangUpButton.addEventListener('click', onClickedHangUpButton)


const haveEvents = 'GamepadEvent' in window;
const rAF = window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

const connecthandler = (e) => {
  addGamepad(e.gamepad);
}

const addGamepad = e => {
  rAF(updateStatus)
}

const updateStatus = () => {
  scangamepads();
  const gp = navigator.getGamepads()[0]
  if (gp.buttons[0].pressed) {
    console.log('button pressed')
    dataChannel.send('turn-on');
  }
  if (gp.buttons[1].pressed) {
    console.log('button pressed')
    dataChannel.send('turn-off');
  }
  rAF(updateStatus)
}

function scangamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  addGamepad(gamepads);
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", addGamepad);
  window.addEventListener("gamepaddisconnected", () => {
    console.log('gamepad disconnected ...  ')
  });
} else {
  setInterval(scangamepads, 500);
}



// const event = 'GamepadEvent' in window;
// const rAF =   window.requestAnimationFrame;
//
//
//
// if (event) {
//   window.addEventListener('gamepadconnected', e => {
//     const gp = navigator.getGamepads()[0]
//     console.log('game pad connected', e)
//     rAF(() => {
//       if (gp.buttons[0].pressed) {
//         console.log('button pressed')
//       }
//     })
//   });
//
//   window.addEventListener('gamepaddisconnected', event => {
//     console.log('A gamepad disconnected');
//   })
// }



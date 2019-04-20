'use strict';

'use strict';

const mediaStreamConstraints = {
  video: true,
};



const localVideo = document.querySelector('video');
const startButton = document.getElementById('startButton')

const remoteVideo = document.getElementById('remoteVideo');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let remoteStream;

let pc1 = null;
let pc2 = null;

let localPeerConnection;
const servers = null;
let startTime = null;


const gotLocalMediaSteream = (mediaStream) => {
  console.log('mediaStream', mediaStream)
  localStream = mediaStream
  localVideo.srcObject = mediaStream;
}

const handleLocalMediaStreamError = (error) => {
  console.log('navigator.getUserMedia error: ', error);
}

const onClickedVideoButton = () => {
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaSteream)
    .catch(handleLocalMediaStreamError);
}
startButton.addEventListener('click', onClickedVideoButton)

const handleLocalIceCandidate = (event) => {
  console.log('localCandidate', event);
  const { candidate } = event;
  if (candidate) {
    console.log('fucking condidate');
    const newIceCandidate = new RTCIceCandidate(candidate);
    pc2.addIceCandidate(newIceCandidate)
  }
}


const gotRemoteStream = (e) => {
  console.log("---gotRemoteStream---")
  console.log("---e---", e)
  remoteVideo.srcObject = e.streams[0];
}

const onVideoCall = () => {
  console.log('__Call Button Clicked');
  pc1 = new RTCPeerConnection();
  pc1.addEventListener('icecandidate', handleLocalIceCandidate);
  
  pc2 = new RTCIceCandidate();
  pc2.addEventListener('icecandidate', handleRemoteIceCandidate);
  pc2.addEventListener('track', gotRemoteStream);
}

callButton.addEventListener('click', onVideoCall)

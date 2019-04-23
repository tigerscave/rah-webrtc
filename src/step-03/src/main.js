'use strict';

const mediaStreamConstraints = {
  video: true,
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;

let pc1 = null;
let pc2 = null;

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

const gotLocalMediaSteream = (mediaStream) => {
  console.log('_mediaStream_', mediaStream)
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
    console.log(' __condidate___');
    const newIceCandidate = new RTCIceCandidate(candidate);
    pc2.addIceCandidate(newIceCandidate)
  }
}

const handleRemoteIceCandidate = (event) => {
  const { candidate } = event;
  if(candidate) {
    const newIceCandidate = new RTCIceCandidate(candidate);
    pc1.addIceCandidate(newIceCandidate);
  }
}

const gotRemoteStream = (e) => {
  console.log("gotRemoteStream", e)
  remoteVideo.srcObject = e.streams[0];
}

const createAnswerSuccess = (description) => {
  console.log("createAnswerSuccess")
  console.log(description)
  pc2.setLocalDescription(description);
  pc1.setRemoteDescription(description);
}

const createOfferSuccess = (description) => {
  console.log("---createOfferSuccess---")
  pc1.setLocalDescription(description);
  
  pc2.setRemoteDescription(description);
  pc2.createAnswer()
    .then(createAnswerSuccess)
    .catch(() => {
      alert('answer failed');
    })
}


const onVideoCall = () => {
  console.log('__Call Button Clicked');
  pc1 = new RTCPeerConnection();
  pc1.addEventListener('icecandidate', handleLocalIceCandidate);
  console.log(pc1, 'this is pc1')
  
  pc2 = new RTCPeerConnection();
  pc2.addEventListener('icecandidate', handleRemoteIceCandidate);
  pc2.addEventListener('track', gotRemoteStream);
  
  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream))
  
  pc1.createOffer(offerOptions)
    .then(createOfferSuccess)
    .catch(()=> {
      alert('createOfferFailed');
    })
}

callButton.addEventListener('click', onVideoCall)

const onHangUpCall = () => {
  console.log('this is hangup call')
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
}
hangupButton.addEventListener('click', onHangUpCall)

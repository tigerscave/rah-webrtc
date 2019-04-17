'use strict';

const mediaStreamConstraints = {
  video: true,
};

const localVideo = document.querySelector('video');

let localStream;

const gotLocalMediaSteream = (mediaStream) => {
  console.log('mediaStream', mediaStream)
  localStream = mediaStream
  localVideo.srcObject = mediaStream;
}

const handleLocalMediaStreamError = (error) => {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaSteream).catch(handleLocalMediaStreamError);



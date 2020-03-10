import { normalize } from './helpers.mjs';

const requestPermission = () => {
  DeviceMotionEvent.requestPermission()
  then((permissionState) => {
    if (permissionState === 'granted') {
      permission = true;
    } else {
      permission = false;
    }
  }).catch((error) => {
    throw new Error('Permission denied');
  });
};

const requestSensor = (socket) => {
  if (!window.DeviceMotionEvent) {
    throw new Error('Event not supported by device');
  }
  let permission = true;
  if (typeof DeviceMotionEvent.requesPermission === 'function') {
    requestPermission();
  }
  if (permission) {
    window.addEventListener('deviceorientation', (event) => {
      const data = {
        x: normalize(event.beta, 45, -45),
        y: normalize(event.gamma, 45, -45)
      }
      socket.emit('sensorData', data);
    });
  }
};

export default requestSensor;
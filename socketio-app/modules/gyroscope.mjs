const requestPermission = () => {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if(permissionState === 'granted') {
        return true;
      }
      return false;
    }).catch((error) => {
      throw new Error('Function failed');
    });
};

export default () => {
  if (!window.DeviceMotionEvent) {
    throw new Error('DeviceMotionEvent is not supported by device');
  }
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    return requestPermission();
  }
  return true;
};
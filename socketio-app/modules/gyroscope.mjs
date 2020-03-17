export default new Promise((resolve, reject) => {
  if (!window.DeviceMotionEvent) {
    reject('DeviceMotionEvent is not supported by device');
  } else if (typeof DeviceMotionEvent.requestPermission === 'function') {
    return DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          resolve('Permission granted');
        } else {
          reject(new Error('Permission denied'));
        }
      }).catch((error) => {
        reject(error);
      });
  } else {
    resolve('No Permission needed');
  }
});
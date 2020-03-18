export default () => {
  return new Promise((resolve, reject) => {
    if (!window.DeviceMotionEvent) {
      reject('DeviceMotionEvent is not supported by device');
    } else if (typeof DeviceMotionEvent.requestPermission === 'function') {
      return DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            resolve('Permission for "DeviceMotionEvent" granted');
          } else {
            reject(new Error('Permission for "DeviceMotionEvent" denied'));
          }
        }).catch((error) => {
          reject(error);
        });
    } else {
      resolve('No permission for "DeviceMotionEvent" needed');
    }
  });
};
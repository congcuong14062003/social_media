// utils/location.js
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(coords);
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };
  
const urlToObject = (image, filename) => new Promise((resolve, reject) => {
  fetch(image, {
    credentials: 'omit',
  }).then((res) => res.blob()) // Gets the response and returns it as a blob
    .then((blob) => {
      const file = new File([blob], filename, { type: blob.type });
      return resolve(file);
    }).catch((err) => reject(err));
});

export default urlToObject;

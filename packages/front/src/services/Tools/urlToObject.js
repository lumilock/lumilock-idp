const urlToObject = async (image, filename) => {
  // return null;
  // eslint-disable-next-line no-unreachable
  const response = await fetch(image, {
    mode: 'no-cors',
  });
  // here image is url/location of image
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });
  return file;
};

export default urlToObject;

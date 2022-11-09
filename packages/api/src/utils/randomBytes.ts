function randomBytes(length: number) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

export default randomBytes;

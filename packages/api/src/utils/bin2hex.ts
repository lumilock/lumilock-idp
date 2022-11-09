function bin2hex(s) {
  //   example 1: bin2hex('Kev')
  //   returns 1: '4b6576'
  //   example 2: bin2hex(String.fromCharCode(0x00))
  //   returns 2: '00'
  let o = '';
  s += '';
  for (let i = 0; i < s.length; i++) {
    const n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? '0' + n : n;
  }
  return o;
}

export default bin2hex;

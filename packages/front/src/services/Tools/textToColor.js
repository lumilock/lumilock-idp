function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function normalisation(x, a = 0, b = 255, minX = 0, maxX = 255) {
  return a + ((x - minX) * (b - a)) / (maxX - minX);
}

function intToRGB(i, rLimits = [0, 255], gLimits = [0, 255], bLimits = [0, 255]) {
  // eslint-disable-next-line no-bitwise
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  const hexa = '00000'.substring(0, 6 - c.length) + c;
  const rgb = hexa.match(/.{1,2}/g);
  const normR = normalisation(parseInt(rgb[0], 16), rLimits[0], rLimits[1]);
  const normG = normalisation(parseInt(rgb[1], 16), gLimits[0], gLimits[1]);
  const normB = normalisation(parseInt(rgb[2], 16), bLimits[0], bLimits[1]);

  const r = Math.round(normR).toString(16).padStart(2, '0').toUpperCase();
  const g = Math.round(normG).toString(16).padStart(2, '0').toUpperCase();
  const b = Math.round(normB).toString(16).padStart(2, '0').toUpperCase();

  return r + g + b;
}

function textToColor(str, min = 0, max = 255) {
  return intToRGB(hashCode(str), [min, max], [min, max], [min, max]);
}

export default textToColor;

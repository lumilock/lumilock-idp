// function that transform a number to alphabetic chars
// ex 1234567 -> 12 3 4 5 6 7 => l c d e f g => lcdefg
function num2Char(seed) {
  return seed
    .toString()
    .match(/.{1,2}/g)
    .map((n) => (n > 26 ? n.split('') : n))
    .flat()
    .map((n) => ((parseInt(n, 10) || 1) + 9).toString(36)) // if 0 -> 1 because 0 = 9 but keep 0 when 10 or 20
    .join('');
}

export default num2Char;

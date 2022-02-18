// function that transform a number to alphabetic chars
// ex 1234567 -> 12 34 56 7 -> 12 3 4 5 6 7 -> l c d e f g -> lcdefg
function num2Char(seed) {
  return seed
    .toString()
    .match(/.{1,2}/g)
    .map((n) => (n > 26 ? n.split('') : n))
    .flat()
    .map((n) => ((parseInt(n, 10) || 26) + 9).toString(36)) // if 0 then 26 because 0 = 9, 1 = a and 26 = z so before a -> z and we want to keep some 0 : when 10 or 20
    .join('');
}

export default num2Char;

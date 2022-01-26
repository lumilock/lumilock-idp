// function to capitalize a given work
function capitalize(word, strict = true) {
  if (strict) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
  return word[0].toUpperCase() + word.slice(1);
}

export default capitalize;

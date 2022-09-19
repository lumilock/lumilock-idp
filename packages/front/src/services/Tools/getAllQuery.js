/**
 * Method to retreave all searchParams from the current address
 * @returns {string[]} all searchParams from the current address
 */
const getAllQuery = (searchParams) => {
  // save the iterator
  const queryEntries = searchParams.entries();
  // select first entry
  let iterator = queryEntries.next();
  // init return array
  const querys = [];
  // init max iter counter
  let countOut = 0;
  while (iterator.done === false && countOut < 50) {
    querys.push(iterator.value);
    iterator = queryEntries.next();
    countOut += 1;
  }
  return querys;
};

export default getAllQuery;

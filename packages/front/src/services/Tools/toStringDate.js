function toStringDate(date) {
  return new Date(
    new Date(date).getTime() + Math.abs(new Date(date).getTimezoneOffset() * 60000),
  )
    .toISOString()
    .substring(0, 10);
}

export default toStringDate;

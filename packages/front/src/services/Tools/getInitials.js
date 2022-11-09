function getInitials(name, number = 3) {
  const rgx = /(?<initial>\p{L}{1})\p{L}+/gu;
  const initials = ([...(name?.matchAll(rgx) || [])] || []).map((r) => r?.groups?.initial);
  return initials.slice(0, number).join('').trim();
}

export default getInitials;

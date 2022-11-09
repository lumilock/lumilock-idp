function noTilde(s: string): string {
  if (!s) return '';
  if (s.normalize != undefined) {
    s = s.normalize('NFKD');
  }
  return s
    ?.trim()
    ?.replace(/ +(?= )/g, '')
    .replace(/[\s.]/g, '-')
    .replace(/[\u0300-\u036F]/g, '');
}

export function noTildes(s: Array<string>): Array<string> {
  return s?.map((st) => noTilde(st));
}

export default noTilde;

/*
pat is a pattern:
  'aaaaaa': string(36) randomly uppercase
  'uuuuuu': string(36) uppercase
  'xxxxxx': string(16)
  'yyyyyy': string(16) clear some bits
  'zzzzzz': string(36) lowercase
 
*/
 
var seed;
 
function generateId(pat) {
  let id = '';
  seed = new Date().getTime();
  const splitsky = pat.split('');
  for (let c of splitsky) {
    id += generateDigit(c);
  }
  console.log(id);
  return id;
}
 
function generateDigit(c) {
  const r = ((seed + Math.random() * 16) % 16 | 0);
  seed = Math.floor(seed / 16);
  if (c === 'a') {
    let a = ((seed + Math.random() * 36) % 36 | 0).toString(36);
    if (((Math.random() * 3) % 3 | 0) === 0) {
      a = a.toUpperCase();
    }
    return a;
  } else if (c === 'b') {
    const b = ((seed + Math.random() * 4) % 4 | 0).toString(4).toUpperCase();
    return b;
  } else if (c === 'u') {
    const u = ((seed + Math.random() * 36) % 36 | 0).toString(36).toUpperCase();
    return u;
  } else if (c === 'x') {
    return r.toString(16);
  } else if (c === 'y') {
    return (r & (0x3|0x8)).toString(16);
  } else if (c === 'z') {
    return ((seed + Math.random() * 36) % 36 | 0).toString(36);
  } else {
    return c;
  }
}
 
exports.generateId = generateId;

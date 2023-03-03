const crypto = require('crypto');

const to_identifier = (i) => {
  const random = crypto.randomBytes(16);
  return random.toString('base64url') + '-' + i;
}
const to_card = (a, strs) => {
  return (i) => {
    const read = x => x[i] === '1';
    const left = strs.map(read);
    const right = left.map(x => !x);
    const bit = a.length - 1 - i;
    const label = { bit, value: 2**bit };
    const bottom = a.map(k => k === bit);
    const identifier = to_identifier(i);
    const edge = { left, right, bottom };
    return { edge, label, identifier };
  }
}
const to_cards = (...strs) => {
  const lens = strs.map(x => x.length);
  const idx = [...Array(Math.min(...lens)).keys()];
  const cards = idx.map(to_card(idx, strs));
  return { idx, cards };
}

module.exports = { to_cards };

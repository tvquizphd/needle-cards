const crypto = require('crypto');

const to_identifier = (i) => {
  const random = crypto.randomBytes(16)
  return random.toString('base64url') + '-' + i;
}
const to_card = (a, strs) => {
  return (i) => {
    const read = x => x[i] === '1';
    const start = strs.map(read);
    const if_nand = start.map(x => !x);
    const left = [ start, if_nand ];
    const bit = a.length - 1 - i;
    const value = 2**bit;
    const label = { bit, value };
    const right = a.map(k => k === bit);
    const identifier = to_identifier(i);
    const edge = { left, right };
    return { edge, label, identifier }
  }
}
const to_cards = (...strs) => {
  const len = Math.min(...strs.map(x => x.length));
  const idx = [...Array(len).keys()];
  const cards = idx.map(to_card(idx, strs));
  return { idx, cards }
}
const needle = (cards, fn, div, hole) => {
  const catch_card_hole = (c) => fn(c)[div][hole];
  const miss_card_hole = (c) => !fn(c)[div][hole];
  const and = cards.find(catch_card_hole) || null;
  const nand = cards.find(miss_card_hole) || null;
  return { nand, and }
}
const needles = (cards, fn, div, holes) => {
  const catch_card_hole = (c) => holes.every(h => fn(c)[div][h]);
  const miss_card_hole = (c) => !holes.every(h => fn(c)[div][h]);
  const and = cards.filter(catch_card_hole);
  const nand = cards.filter(miss_card_hole);
  return { nand, and }
}
const half_add = (cards) => {
  const left = (c) => c.edge.left;
  const { nand: n, and: a } = needles(cards, left, 0, [0, 1]);
  const { nand: nn, and: na } = needles(n, left, 1, [0, 1]);
  return { sum: nn, carry: a, empty: na };
}
const match_card = (c1) => {
  return (c2) => c1.identifier === c2.identifier;
}
const unmatch_card = (c1) => {
  return (c2) => c1.identifier !== c2.identifier;
}
const move_card_pile = (_from, _to, card) => {
  const from = _from.filter(unmatch_card(card));
  const move = _from.filter(match_card(card));
  const to = [..._to, ...move];
  return { from, to };
}
const log_labels = (...lists) => {
  lists.forEach(cards => {
    console.log(cards.map(c => c.label))
  })
}
const tab_add = (b1, b2) => {
  const right = (c) => [c.edge.right];
  const { idx, cards } = to_cards(b1, b2);
  let { sum, carry, empty } = half_add(cards);
  let hot = [];
  idx.slice(1).forEach(i => {
    const carry_in = needle([...carry, ...hot], right, 0, i - 1).and;
    const sum_in = needle([...sum, ...hot], right, 0, i).and;
    if (carry_in && sum_in) {
      // Just carried, not counted
      const swap = move_card_pile(sum, carry, sum_in);
      sum = swap.from;
      carry = swap.to;
    }
    else if (carry_in || sum_in) {
      // carry_in XOR sum_in
      const in_empty = needle(empty, right, 0, i).and;
      const in_carry = needle(carry, right, 0, i).and;
      if (in_carry) {
        // Both carried and counted
        const swap = move_card_pile(carry, hot, in_carry);
        carry = swap.from;
        hot = swap.to;
      }
      else if (in_empty) {
        // Not carried, just counted
        const swap = move_card_pile(empty, sum, in_empty);
        empty = swap.from;
        sum = swap.to;
      }
    }
  });
  const look_at_values = (cards) => {
    return cards.reduce((o, i) => o + i.label.value, 0);
  }
  return look_at_values([...sum, ...hot]);
}

const add = (a, b) => {
  const to_n = x => Math.ceil(Math.log2(x + 1)) + 1;
  const n_bits = Math.max(...[a,b].map(to_n));
  const to_pad = x => x.padStart(n_bits, '0');
  const to_bits = x => x.toString(2) 
  const str = [a, b].map(to_bits);
  const bits = str.map(to_pad);
  return tab_add(...bits);
}

const start = () => {
  // Matrix of arbitrary test integers
  const test = [0, 1, 2, 3, 10, 20, 69, 100, 200, 233, 420];
  const out = [].concat(...test.map(a => {
    return test.map(b => {
      return [a+b, add(a, b), a, b];
    });
  }));
  // All additions are correct
  return out.filter(([a,b]) => a !== b);
}

console.log(start())

const { to_cards } = require('./lib/to_cards');
const { to_binary } = require('./lib/to_binary');
const { see_if, swap_if } = require('./lib/use_cards');
const { needle, see_cards } = require('./lib/use_cards');

const needles = (cards, edge, holes) => {
  // Select cards with needles in 2+ holes at once
  const thru_hole = (c, h) => needle([c], edge, h);
  const nand = cards.filter(c => holes.some(h => !thru_hole(c, h)));
  const and = cards.filter(c => holes.every(h => thru_hole(c, h)));
  return { nand, and }
}

const half_add = (cards) => {
  // Half adder implemented using nand gates
  const { nand: n, and: a } = needles(cards, 'left', [0, 1]);
  const { nand: nn, and: na } = needles(n, 'right', [0, 1]);
  return { both: [], sum: nn, carry: a, empty: na };
}

const needle_add = ({ idx, cards }) => {
  // Finish addition of half-added cards
  const o = idx.slice(1).reduce((o, i) => {
    if (see_if([...o.carry, ...o.both], i - 1)) {
      const can_sum = [...o.sum, ...o.both];
      if (swap_if(o.empty, i, o, 'empty', 'sum'));
      else if (swap_if(can_sum, i, o, 'sum', 'carry'));
      else if (swap_if(o.carry, i, o, 'carry', 'both'));
    };
    return o;
  }, half_add(cards));
  // Read out the cards from sum and both
  return see_cards([...o.sum, ...o.both]);
}

const add = (a, b) => {
  // Add physical cards for two integer bitstrings
  return needle_add(to_cards(...to_binary(a, b)));
}

const start = () => {
  // Matrix of arbitrary test integers
  const test = [0, 1, 2, 3, 10, 20, 69, 100, 200, 233, 420];
  const out = [].concat(...test.map(a => {
    return test.map(b => {
      const sum = add(a, b);
      return [a+b === sum, `${sum} = ${a} + ${b}`];
    });
  }));
  // All additions are correct
  return out.filter(([ok]) => !ok);
}

console.log(start().length ? 'Fail' : 'Pass');

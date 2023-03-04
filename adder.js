const { log_o } = require('./lib/logger');
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

const half_add = (cards, LOG) => {
  if (LOG) console.log('(');
  if (LOG) log_o({ all: cards });
  // Half adder implemented using nand gates
  const { nand: n, and: a } = needles(cards, 'left', [0, 1]);
  const { nand: nn, and: na } = needles(n, 'right', [0, 1]);
  if (LOG) log_o({ sum: nn, carry: a });
  if (LOG) console.log(')');
  return { both: [], sum: nn, carry: a, empty: na };
}

const needle_add = ({ idx, cards }, LOG) => {
  // Finish addition of half-added cards
  const o = idx.slice(1).reduce((o, i) => {
    if (see_if([...o.carry, ...o.both], i - 1)) {
      if (swap_if(o.empty, i, o, 'empty', 'sum'));
      else if (swap_if(o.sum, i, o, 'sum', 'carry'));
      else if (swap_if(o.carry, i, o, 'carry', 'both'));
      // Only for logs: clean up the used carry bit
      swap_if(o.carry, i - 1, o, 'carry', 'empty')
      if (LOG) log_o(o, i);
    };
    return o;
  }, half_add(cards, LOG));
  // Read out the cards from sum and both
  const out = [...o.sum, ...o.both];
  if (LOG) console.log('(');
  if (LOG) log_o({ out });
  if (LOG) console.log(')');
  return see_cards(out);
}

const add = (a, b, LOG) => {
  const [x, y] = to_binary(a, b);
  if (LOG) console.log([x, y].join(' + '));
  // Add physical cards for two integer bitstrings
  return needle_add(to_cards(x, y), LOG);
}

const test = () => {
  // Matrix of arbitrary test integers
  const test = [0, 1, 2, 3, 10, 20, 69, 100, 200, 233, 420];
  const out = [].concat(...test.map(a => {
    return test.map(b => {
      const sum = add(a, b, false);
      return [a+b === sum, `${sum} = ${a} + ${b}`];
    });
  }));
  // All additions are correct
  return out.filter(([ok]) => !ok);
}

const args = process.argv.slice(2);
if (args.length === 3 && args[1] === "+") {
  args.splice(1, 1);
}
if (args.length === 2) {
  const [a, b] = args.map(x => parseInt(x));
  const sum = add(a, b, true);
  if (sum !== a+b) console.error('Fail');
  else console.log(`Done\n${a} + ${b} = ${sum}`);
}
else {
  console.log('TESTING...');
  console.log(test().length ? 'Fail' : 'Pass');
}

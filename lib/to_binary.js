const max_bits = (...args) => {
  const to_n = x => Math.ceil(Math.log2(x + 1)) + 1;
  return Math.max(...args.map(to_n));
}

const to_bits = (n_bits) => {
  return x => x.toString(2).padStart(n_bits, '0');
}

const to_binary = (...args) => {
  return args.map(to_bits(max_bits(...args)));
}

module.exports = { to_binary };

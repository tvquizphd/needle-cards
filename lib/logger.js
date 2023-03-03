const log_o = (o, i) => {
  const to_str = (x,i) => ['𝚘','v'][+x];
  const to_bits = (c) => {
    const val = c.edge.left.map(to_str).join('');
    return [val, c.label.value].join('.');
  }
  const serial = (k) => {
    if (k !== 'all') return o[k].map(to_bits);
    return o[k].map(c => to_bits(c).split('.')[0]);
  }
  const keys = ['out', 'all', 'sum', 'carry', 'both'];
  const out = keys.filter(k => o[k]?.length).map(k => {
    return k + '(' + serial(k).join('|') + ')';
  });
  const prefix = i > 0 ? `Carrying ${2**i}` : ' ';
  console.log(prefix + ': ' + out.join(' '));
}

module.exports = { log_o };

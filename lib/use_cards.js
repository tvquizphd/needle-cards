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
const needle = (cards, edge, hole) => {
  const thru_hole = c => c.edge[edge][hole];
  return cards.find(c => thru_hole(c)) || null;
}
const see_if = (set, s) => {
  return needle(set, 'bottom', s);
}
const swap_if = (set, s, o, from, to) => {
  const in_set = see_if(set, s);
  if (in_set === null) return false;
  const swap = move_card_pile(o[from], o[to], in_set);
  o[from] = swap.from;
  o[to] = swap.to;
  return o;
}
const see_cards = (cards) => {
  return cards.reduce((o, i) => o + i.label.value, 0);
}

module.exports = {
  needle, see_if, swap_if, see_cards
}

### Needle Cards

Before computers, databases used [notched paper cards][hackaday]. Card edges had many holes. Each hole had a label. Cutting the hole open stored "yes" for the column.

Say each card is a book index. You stack the cards, running a needle through the same labeled hole for all cards. If you poke a needle in the "History" hole of all cards, the remaining cards locate "History" books. If you poke the "Math" hole of the remaining cards, any remaining cards find any books on both "History" and "Math". In general, poking two holes leaves `X AND Y` on the table, and the needle lifts away the other cards with only `X`, only `Y`, or neither. So, poking two holes pulls away `NOT (X AND Y)` or `X NAND Y`, for short. 

With that, we can [add two numbers][nand] in binary. As an example, 5 is `0101` and 3 is `0011`. The sum, 8, is `1000`. This 4-bit sum needs four paper cards to pull this off. We read `0101 & 0011` zipped together. The greatest card is `0 & 0` from the first bits, the next is `1 & 0`, then `0 & 1`, then the lowest card is `1 & 1` from the last bits. Cut both bits into one side of the card, and cut the opposite into the other side. The top edges of `N` cards also have `N` holes, with one specific hole cut. We cut the 4th hole for `2^3`, writing `8` in pen on the card. We cut the 3rd hole for `2^2`, writing `4` on it.  The 2nd hole is for `2^1`, or `2`. The 1st hole is on the lowest card, with `1` written on it.

---

After that, run the steps in `adder.js` yourself on the cards with a pair of knitting needles or chopsticks!

Or, run `node adder.js 5 3` to see `8 = 5 + 3` simulated with paper, holes, notches, and needles.

[hackaday]: https://hackaday.com/2019/06/18/before-computers-notched-card-databases/
[nand]: https://www.eeweb.com/full-adder-nand-equivalent/

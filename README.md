# arhan.js

A collection of my personal JavaScript tooling utilities for use within Chrome DevTools, loaded automatically with its own Chrome extension. Primarily used for my CTF competitions and day to day scripting shenanigans.

Example usage:

```js
> for (i of range(0xff+1)) lg(i.hex)
00
01
02
...
fd
fe
ff
```

```js
> `1
  3
  5
  7
  9`.splitnl().sum.cp // copy to clipboard
Number {25}
```

```js
> const encode = s => s.split('').map(i => i.bin).join('').dec
undefined
> const decode = n => n.bin.chunks(8).map(i => i.chr).join('')
undefined
> encode("I like cats")
88404700403956105303127155n
> decode(encode("I like cats"))
'I like cats'
```

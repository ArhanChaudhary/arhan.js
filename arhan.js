/*
 * arhan.js
 *
 * A collection of my personal JavaScript tooling functions for use within
 * DevTools.
 */

//
// --- Conversion functions ---
//
Number.prototype.dec = function () {
  return this;
};

Number.prototype.hex = function () {
  return "0x" + this.toString(16).padStart(2, "0");
};

Number.prototype.bin = function () {
  return "0b" + this.toString(2).padStart(8, "0");
};

Number.prototype.chr = function () {
  return String.fromCharCode(this);
};

String.prototype.dec = function () {
  if (/^[a-zA-Z]$/.test(this)) {
    return this.charCodeAt(0);
  }
  let ret = Number(this);
  if (!Number.isNaN(ret)) {
    return ret;
  }
  throw new Error("Invalid decimal conversion");
};

String.prototype.hex = function () {
  return this.dec().hex();
};

String.prototype.bin = function () {
  return this.dec().bin();
};

String.prototype.chr = function () {
  return this.dec().chr();
};

//
// --- General utilities ---
//
String.prototype.cp =
  Number.prototype.cp =
  Array.prototype.cp =
    function () {
      globalThis.copy?.(this.toString()); // not available everywhere
      return this;
    };

Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b.dec(), 0);
};

globalThis.nl = "\n"; // :D

globalThis.lg = console.log;

//
// --- Iterator stuff ---
//
globalThis.xrange = function* (start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === 0) {
    throw new Error("Step cannot be zero");
  }
  if (step < 0) {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  }
};

globalThis.range = function (...args) {
  return [...globalThis.xrange(...args)];
};

globalThis.zip = function (...iterables) {
  return Array.from(
    { length: Math.min(...iterables.map(({ length }) => length)) },
    (_, i) => iterables.map((x) => x[i])
  );
};

String.prototype.chunks = function (n) {
  return this.match(new RegExp(`.{1,${n}}`, "g"));
};

String.prototype.smapj = function (split, map) {
  return this.split(split).map(map).join("");
};

console.log("arhan.js loaded");

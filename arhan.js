/*
 * arhan.js
 *
 * A collection of my personal JavaScript tooling functions for use within
 * DevTools.
 */
(() => {
  const cp = {
    get: function () {
      globalThis.copy?.(this.toString()); // not available everywhere
      return this;
    },
  };

  Object.defineProperties(Number.prototype, {
    dec: {
      get: function () {
        return this;
      },
    },
    hex: {
      get: function () {
        return this.toString(16).padStart(2, "0");
      },
    },
    bin: {
      get: function () {
        return this.toString(2).padStart(8 * Math.ceil(this.length / 8), "0");
      },
    },
    chr: {
      get: function () {
        return String.fromCharCode(this);
      },
    },
    cp,
  });

  Object.defineProperties(String.prototype, {
    dec: {
      get: function () {
        let ret;
        if (this.length === 1) {
          ret = this.charCodeAt(0);
          if (ret < 48 || ret > 57) {
            return ret;
          }
        }
        ret = Number(this);
        if (!Number.isNaN(ret)) {
          return ret;
        } else {
          ret = parseInt(this, 16);
          if (!Number.isNaN(ret)) {
            return ret;
          }
        }
        throw new Error("Invalid decimal conversion");
      },
    },
    hex: {
      get: function () {
        return this.dec.hex;
      },
    },
    bin: {
      get: function () {
        return this.dec.bin;
      },
    },
    chr: {
      get: function () {
        return this.dec.chr;
      },
    },
    chunks: {
      value: function (n) {
        return this.match(new RegExp(`.{1,${n}}`, "g"));
      },
    },
    smapj: {
      value: function (split, map) {
        return this.split(split).map(map).join("");
      },
    },
    cp,
  });

  Object.defineProperties(Array.prototype, {
    sum: {
      get: function () {
        return this.reduce((a, b) => a + b.dec, 0);
      },
    },
    cp,
  });

  Object.defineProperties(globalThis, {
    xrange: {
      value: function* (start, end, step = 1) {
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
      },
    },
    range: {
      value: function (...args) {
        return [...globalThis.xrange(...args)];
      },
    },
    zip: {
      value: function (...iterables) {
        return Array.from(
          { length: Math.min(...iterables.map(({ length }) => length)) },
          (_, i) => iterables.map((x) => x[i])
        );
      },
    },
    lg: {
      value: console.log,
    },
    nl: {
      // :D
      value: "\n",
    },
  });

  console.log("arhan.js loaded");
})();

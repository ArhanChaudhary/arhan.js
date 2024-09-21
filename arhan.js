/*
 * arhan.js
 *
 * A collection of my personal JavaScript tooling functions for use within
 * DevTools.
 */

(async () => {
  const cp = {
    get: function () {
      globalThis.copy?.(this.toString()); // not available everywhere
      return this;
    },
  };

  const decimalPrototypes = {
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
        return this.toString(2).padStart(
          8 * Math.ceil(this.toString(2).length / 8),
          "0"
        );
      },
    },
  };

  Object.defineProperties(Number.prototype, {
    ...decimalPrototypes,
    chr: {
      get: function () {
        return String.fromCharCode(this);
      },
    },
    cp,
  });

  Object.defineProperties(BigInt.prototype, {
    ...decimalPrototypes,
    chr: {
      get: function () {
        throw new Error("BigInt does not have a character representation");
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
        const interpretAsBinary = this.length % 8 === 0 && /^[01]+$/.test(this);
        if (interpretAsBinary) {
          ret = Number("0b" + this);
        } else {
          ret = Number(this);
        }
        if (!Number.isNaN(ret)) {
          if (ret <= Number.MAX_SAFE_INTEGER) {
            return ret;
          }
          if (interpretAsBinary) {
            return BigInt("0b" + this);
          }
          return BigInt(this);
        } else {
          ret = parseInt(this, 16);
          if (!Number.isNaN(ret)) {
            if (ret <= Number.MAX_SAFE_INTEGER) {
              return ret;
            }
            if (this.startsWith("0x") || this.startsWith("0X")) {
              return BigInt(this);
            }
            return BigInt("0x" + this);
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
    splitnl: {
      value: function () {
        return this.split(/\r?\n/);
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
    chunks: {
      value: function (n) {
        let ret = [];
        for (let i = 0; i < this.length; i += n) {
          ret.push(this.slice(i, i + n));
        }
        return ret;
      },
    },
    cp,
  });

  // https://umaranis.com/2018/07/12/calculate-modular-exponentiation-powermod-in-javascript-ap-n/
  Math.powm = function (base, exponent, modulus) {
    modulus = BigInt(modulus);
    if (modulus === 1n) return 0;
    base = BigInt(base);
    exponent = BigInt(exponent);
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) result = (result * base) % modulus;
      exponent = exponent >> 1n;
      base = (base * base) % modulus;
    }
    if (result <= Number.MAX_SAFE_INTEGER) {
      return Number(result);
    }
    return result;
  };
  await new Promise((resolve) => addEventListener("load", resolve));

  let globalThisProperties = {
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
  };
  for (let key of Object.keys(globalThisProperties)) {
    // use in to check for properties in the prototype chain
    if (key in globalThis) {
      throw new Error(`arhan.js: ${key} is already defined`);
    }
  }
  Object.defineProperties(globalThis, globalThisProperties);

  console.log("arhan.js loaded");
})();

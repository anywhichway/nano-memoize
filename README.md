[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

During development we also discovered that despite its popularity and goal to be the fastest possible memoizer, `fast-memoize` is actually one of the slowest out-of-the-box when it comes to multiple argument functions. It uses `JSON.stringify` as key generator. It also only memoizes out to 3 arguments. This is not to say it should not be used, it also seems to have the cleanest software architecture and it may be theoretically possible to write a high-speed multi-argument plugin. And, MANY people are very happy with it.

Special appreciation to @titoBouzout and @popbee who spent a good bit of time reviewing code for optimization and making recommendations. See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4) for the conversation.

The minified/brotli size is 640 Brotli bytes for `nano-memoize` v1.1.0 vs 2020 bytes for `micro-memoize` v3.0.1. And, `nano-memoize` has slightly more functionality.

The speed tests are below. In most cases `nano-memoize` is the fastest.
 
 * For single primitive argument functions it is comparable to, but slightly and probably un-importantly faster that `fast-memoize`.
 
 * For single primitive argument functions it is comparable to, but slightly and probably un-importantly faster that `fast-memoize`.
 
 * For multiple primitive argument functions`nano-memoize` is slightly and probably un-importantly faster than `micro-memoize`. 

 * For multiple object argument functions `nano-memoize` is slightly and probably un-importantly faster than `micro-memoize`.
 
 * When `deepEquals` tests are used, `micro-memoize` rules the day. 

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 64bit 2.4ghz machine with 8GB RAM and Node v11.6.0. Also, even with multiple samplings, garbage collection can have a substative impact and multiple runs in different orders are really required for apples-to-apples comparisons.


Functions with a single primitive parameter...

```
+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------+
¦ nano-memoize  ¦ 59,229,772 ¦ ± 0.72%                  ¦ 75          ¦
+---------------------------------------------------------------------+
¦ fast-memoize  ¦ 53,557,422 ¦ ± 4.65%                  ¦ 61          ¦
+---------------------------------------------------------------------+
¦ micro-memoize ¦ 11,102,228 ¦ ± 9.04%                  ¦ 56          ¦
+---------------------------------------------------------------------+
¦ iMemoized     ¦ 10,207,666 ¦ ± 11.93%                 ¦ 40          ¦
+---------------------------------------------------------------------+
¦ moize         ¦ 7,753,586  ¦ ± 41.02%                 ¦ 57          ¦
+---------------------------------------------------------------------+
¦ lodash        ¦ 6,364,484  ¦ ± 11.60%                 ¦ 43          ¦
+---------------------------------------------------------------------+
¦ lru-memoize   ¦ 4,383,453  ¦ ± 39.83%                 ¦ 59          ¦
+---------------------------------------------------------------------+
¦ underscore    ¦ 4,159,229  ¦ ± 13.33%                 ¦ 64          ¦
+---------------------------------------------------------------------+
¦ memoizee      ¦ 4,067,506  ¦ ± 19.14%                 ¦ 40          ¦
+---------------------------------------------------------------------+
¦ memoizerific  ¦ 1,145,407  ¦ ± 4.27%                  ¦ 65          ¦
+---------------------------------------------------------------------+
¦ addy-osmani   ¦ 639,076    ¦ ± 22.97%                 ¦ 57          ¦
+---------------------------------------------------------------------+
```

Functions with a single object parameter...

```
+--------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+--------------------------------------------------------------------+
¦ nano-memoize  ¦ 20,377,511 ¦ ± 2.18%                  ¦ 71          ¦
+--------------------------------------------------------------------+
¦ fast-memoize  ¦ 15,132,122 ¦ ± 6.55%                  ¦ 60          ¦
+--------------------------------------------------------------------+
¦ micro-memoize ¦ 15,128,905 ¦ ± 4.30%                  ¦ 62          ¦
+--------------------------------------------------------------------+
¦ moize         ¦ 11,712,302 ¦ ± 4.93%                  ¦ 61          ¦
+--------------------------------------------------------------------+
¦ iMemoized     ¦ 10,145,254 ¦ ± 3.17%                  ¦ 62          ¦
+--------------------------------------------------------------------+
¦ lodash        ¦ 7,161,180  ¦ ± 3.72%                  ¦ 59          ¦
+--------------------------------------------------------------------+
¦ underscore    ¦ 5,789,882  ¦ ± 2.62%                  ¦ 70          ¦
+--------------------------------------------------------------------+
¦ lru-memoize   ¦ 3,881,960  ¦ ± 4.34%                  ¦ 61          ¦
+--------------------------------------------------------------------+
¦ memoizee      ¦ 2,566,037  ¦ ± 1.66%                  ¦ 67          ¦
+--------------------------------------------------------------------+
¦ memoizerific  ¦ 1,111,770  ¦ ± 1.80%                  ¦ 78          ¦
+--------------------------------------------------------------------+
¦ addy-osmani   ¦ 1,001,119  ¦ ± 4.98%                  ¦ 61          ¦
+--------------------------------------------------------------------+
```

Functions with multiple parameters that contain only primitives...

```
+--------------------------------------------------------------------+
¦ Name          ¦ Ops / sec ¦ Relative margin of error ¦ Sample size ¦
+--------------------------------------------------------------------+
¦ nano-memoize  ¦ 7,109,499 ¦ ± 3.64%                  ¦ 67          ¦
+--------------------------------------------------------------------+
¦ micro-memoize ¦ 7,052,676 ¦ ± 5.64%                  ¦ 61          ¦
+--------------------------------------------------------------------+
¦ moize         ¦ 6,470,805 ¦ ± 2.41%                  ¦ 72          ¦
+--------------------------------------------------------------------+
¦ lru-memoize   ¦ 3,128,711 ¦ ± 3.89%                  ¦ 69          ¦
+--------------------------------------------------------------------+
¦ memoizee      ¦ 1,770,348 ¦ ± 16.76%                 ¦ 57          ¦
+--------------------------------------------------------------------+
¦ iMemoized     ¦ 1,004,645 ¦ ± 19.13%                 ¦ 58          ¦
+--------------------------------------------------------------------+
¦ memoizerific  ¦ 690,537   ¦ ± 11.49%                 ¦ 57          ¦
+--------------------------------------------------------------------+
¦ addy-osmani   ¦ 421,059   ¦ ± 5.01%                  ¦ 68          ¦
+--------------------------------------------------------------------+
¦ fast-memoize  ¦ 253,637   ¦ ± 2.84%                  ¦ 66          ¦
+--------------------------------------------------------------------+
```

Functions with multiple parameters that contain objects...

```
+--------------------------------------------------------------------+
¦ Name          ¦ Ops / sec ¦ Relative margin of error ¦ Sample size ¦
+--------------------------------------------------------------------+
¦ nano-memoize  ¦ 7,115,350 ¦ ± 3.16%                  ¦ 66          ¦
+--------------------------------------------------------------------+
¦ micro-memoize ¦ 6,868,295 ¦ ± 3.63%                  ¦ 66          ¦
+--------------------------------------------------------------------+
¦ moize         ¦ 4,196,397 ¦ ± 24.14%                 ¦ 61          ¦
+--------------------------------------------------------------------+
¦ lru-memoize   ¦ 3,284,142 ¦ ± 2.82%                  ¦ 68          ¦
+--------------------------------------------------------------------+
¦ memoizee      ¦ 1,333,993 ¦ ± 3.18%                  ¦ 70          ¦
+--------------------------------------------------------------------+
¦ memoizerific  ¦ 807,252   ¦ ± 6.46%                  ¦ 72          ¦
+--------------------------------------------------------------------+
¦ addy-osmani   ¦ 218,191   ¦ ± 3.84%                  ¦ 73          ¦
+--------------------------------------------------------------------+
¦ fast-memoize  ¦ 175,937   ¦ ± 8.04%                  ¦ 59          ¦
+--------------------------------------------------------------------+
```

Deep equals ...

```
+---------------------------------------------------------------------------------------------------------+
¦ Name                                              ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (lodash isEqual)        ¦ 12,400,181 ¦ ± 19.08%                 ¦ 61          ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (fast-equals deepEqual) ¦ 12,082,145 ¦ ± 14.66%                 ¦ 47          ¦
+---------------------------------------------------------------------------------------------------------+
¦ nanomemoize deep equals (lodash isEqual)          ¦ 6,136,579  ¦ ± 82.87%                 ¦ 51          ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (hash-it isEqual)       ¦ 4,010,002  ¦ ± 42.97%                 ¦ 44          ¦
+---------------------------------------------------------------------------------------------------------+
¦ nanomemoize deep equals (fast-equals deepEqual)   ¦ 3,539,280  ¦ ± 43.70%                 ¦ 43          ¦
+---------------------------------------------------------------------------------------------------------+
```

We were puzzled about the multiple argument performance on `fast-memoize` given its stated goal of being the "fastest possible". We discovered that the default caching and serialization approach used by fast-memoize only performs well for single argument functions for two reasons:

1) It uses `JSON.stringify` to create a key for an entire argument list. This can be slow.

2) Because a single key is generated for all arguments when perhaps only the first argument differs in a call, a lot of extra work is done. The `moize` and `micro-memoize` approach adopted by `nano-memoize` is far faster for multiple arguments.


# Usage

`npm install nano-memoize`

Use the code in the [`browser`](browser/) directory for the browser

Since most devs are running a build pipeline, the code is not transpiled, although it is browserified


# API

The API is a subset of the `moize` API.

```javascript
const memoized = nanonmemoize(sum(a,b) => a + b);
memoized(1,2); // 3
memoized(1,2); // pulled from cache
```

`nanonmemoize(function,options) returns function`

The shape of options is:

```javascript
{
  // only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
  maxArgs: number, 
  // number of milliseconds to cache a result, set to `Infinity` to never create timers or expire
  maxAge: number, 
  // the serializer/key generator to use for single argument functions (multi-argument functionsuse equals)
  serializer: function,
  // the equals function to use for multi-argument functions, e.g. deepEquals for objects (single-argument functions serializer)
  equals: function, 
  // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
  vargs: boolean 
}
```

To clear the cache you can call `.clear()` on the function returned my `nanomemoize`.

# Release History (reverse chronological order)

2019-03-25 v1.1.1 Pushed incorrect version with v1.1.0. This corrects the version push.

2019-03-25 v1.1.0 Added use of `WeakMap` for high-speed caching of single argument functions when passed objects. The `serializer` option no longer defaults to `(value) => JSON.stringify(value)` so if you want to treat objects that have the same string representation as the same, you will have to provide a `serializer`.

2019-03-24 v1.0.8 Updated/corrected documentation.

2019-03-24 v1.0.7 Made smaller and faster. Renamed `sngl` to `sng` and `mltpl` to `mlt`. Converted all functions to arrow functions except `sng` and `mlt`. Simplified and optimized `mlt`. Removed `()` around args to single argument arrow function definitions, e.g. `(a) => ...` became `a => ...`. Replaced the arg signature `()` in arrow functions with `_`, which is shorter. Eliminated multiple character variables except for those used in options to request memoization. Collapsed `setTimeout` into a single location. Defined `const I = Infinity`. Eliminated `()` around `? :` condition expressions.  Changed `{}` to `Object.create(null)`. Documented all variables. Moved some variables around for clarity. Moved `options` into a destructing argument.

2019-03-20 v1.0.6 Updated documentation.

2019-03-11 v1.0.5 Now supports setting `maxAge` to Infinity and no timers will be created to expire caches.

2019-02-26 v1.0.4 Further optimized cache expiration. See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4)

2019-02-16 v1.0.3 Fixed README formatting

2019-02-16 v1.0.2 Further optimizations to deal with [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4). `expireInterval` introduced in v1.0.1 removed since it is no longer needed. Also, 25% reduction in size. Code no longer thrashes when memoizing a large number of functions.

2019-02-16 v1.0.1 Memo expiration optimization. Issue 4 addressed.

2018-04-13 v1.0.0 Code style improvements.

2018-02-07 v0.1.2 Documentation updates

2018-02-07 v0.1.1 Documentationand benchmark updates

2018-02-01 v0.1.0 Documentation updates. 50 byte decrease.

2018-01-27 v0.0.7b BETA Documentation updates.

2018-01-27 v0.0.6b BETA Minor size and speed improvements.

2018-01-27 v0.0.5b BETA Fixed edge case where multi-arg key may be shorter than current args.

2018-01-27 v0.0.4b BETA Fixed benchmarks. Removed maxSize. More unit tests. Fixed maxAge.

2018-01-27 v0.0.3b BETA More unit tests. Documentation. Benchmark code in repository not yet running.

2018-01-24 v0.0.2a ALPHA Minor speed enhancements. Benchmark code in repository not yet running.

2018=01-24 v0.0.1a ALPHA First public release. Benchmark code in repository not yet running.

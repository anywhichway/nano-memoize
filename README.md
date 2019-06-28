[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

During development we also discovered that despite its popularity and goal to be the fastest possible memoizer, `fast-memoize` is actually one of the slowest out-of-the-box when it comes to multiple argument functions because it uses `JSON.stringify` to generate a single key generator for all arguments. It also only memoizes out to 3 arguments, which may cause issues. This is not to say it should not be used, it also seems to have the cleanest software architecture and it may be theoretically possible to write a high-speed multi-argument plugin. And, MANY people are very happy with it.

Special appreciation to @titoBouzout and @popbee who spent a good bit of time reviewing code for optimization and making recommendations. See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4) for the conversation.

The minified/brotli size is 660 bytes for `nano-memoize` v1.1.5 vs 1,356 bytes for `micro-memoize` v4.08. And, `nano-memoize` has slightly more functionality.

The speed tests are below. At the time of testing the most recent version of `fast-memoize` 2.5.1 was a year old. The most recent version of `micro-memoize` 4.0.8 was 14 days old.
 
 * For single primitive argument functions `nano-memoize` runs neck-and-neck with `fast-memoize` and 3-4x faster than `micro-memoize`.
 
 * For single object argument functions `nano-memoize` is typically 10% faster than `fast-memoize` and 1.75x faster than `micro-memoize`.
 
 * For multiple primitive argument functions `nano-memoize` is about 20% faster than `micro-memoize`. They are 60x faster than `fast-memoize`.

 * For multiple object argument functions `nano-memoize` is typically 20% faster than `micro-memoize` and 60x faster than `fast-memoize`.
 
 * When `deepEquals` tests are used, `nano-memoize` is 33% faster than micro-memoize. `fast-memoize` is by default deep equals and `nano-memoize` is 60x faster.

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 Pro 64bit 1.8ghz i7 machine with 16GB RAM and Node v11.6.0. Also, even with multiple samplings, garbage collection can have a substative impact and multiple runs in different orders are really required for apples-to-apples comparisons.

Functions with a single primitive parameter...

```
+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+----------------------------------------------------------------------+
¦ nano-memoize  ¦ 429,266,986 ¦   0.53%                  ¦ 95          ¦
+----------------------------------------------------------------------+
¦ fast-memoize  ¦ 423,833,441 ¦   0.62%                  ¦ 94          ¦
+----------------------------------------------------------------------+
¦ moize         ¦ 95,351,935  ¦   1.54%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ iMemoized     ¦ 82,908,646  ¦   0.76%                  ¦ 89          ¦
+----------------------------------------------------------------------+
¦ micro-memoize ¦ 74,658,533  ¦   2.16%                  ¦ 86          ¦
+----------------------------------------------------------------------+
¦ lru-memoize   ¦ 73,747,331  ¦   0.59%                  ¦ 89          ¦
+----------------------------------------------------------------------+
¦ lodash        ¦ 48,098,010  ¦   1.79%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ memoizee      ¦ 39,111,373  ¦   0.53%                  ¦ 95          ¦
+----------------------------------------------------------------------+
¦ underscore    ¦ 34,623,228  ¦   1.22%                  ¦ 95          ¦
+----------------------------------------------------------------------+
¦ memoizerific  ¦ 6,905,607   ¦   2.16%                  ¦ 91          ¦
+----------------------------------------------------------------------+
¦ addy-osmani   ¦ 6,319,914   ¦   0.94%                  ¦ 91          ¦
+----------------------------------------------------------------------+
```

Functions with a single object parameter...

```
+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+----------------------------------------------------------------------+
¦ nano-memoize  ¦ 124,264,741 ¦   0.61%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ fast-memoize  ¦ 111,267,506 ¦   0.74%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ moize         ¦ 95,260,557  ¦   0.88%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ iMemoized     ¦ 73,937,479  ¦   0.67%                  ¦ 93          ¦
+----------------------------------------------------------------------+
¦ micro-memoize ¦ 66,863,547  ¦   4.08%                  ¦ 80          ¦
+----------------------------------------------------------------------+
¦ lodash        ¦ 47,881,566  ¦   1.41%                  ¦ 90          ¦
+----------------------------------------------------------------------+
¦ underscore    ¦ 34,777,812  ¦   0.79%                  ¦ 92          ¦
+----------------------------------------------------------------------+
¦ lru-memoize   ¦ 31,919,125  ¦   0.33%                  ¦ 98          ¦
+----------------------------------------------------------------------+
¦ memoizee      ¦ 18,033,950  ¦   0.55%                  ¦ 89          ¦
+----------------------------------------------------------------------+
¦ memoizerific  ¦ 6,600,328   ¦   1.28%                  ¦ 95          ¦
+----------------------------------------------------------------------+
¦ addy-osmani   ¦ 6,346,356   ¦   1.02%                  ¦ 93          ¦
+----------------------------------------------------------------------+
```

Functions with multiple parameters that contain only primitives...

```
+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------+
¦ nano-memoize  ¦ 64,862,221 ¦   0.98%                  ¦ 91          ¦
+---------------------------------------------------------------------+
¦ moize         ¦ 62,050,114 ¦   0.46%                  ¦ 95          ¦
+---------------------------------------------------------------------+
¦ micro-memoize ¦ 53,790,249 ¦   0.42%                  ¦ 93          ¦
+---------------------------------------------------------------------+
¦ lru-memoize   ¦ 25,083,521 ¦   0.43%                  ¦ 97          ¦
+---------------------------------------------------------------------+
¦ memoizee      ¦ 16,817,318 ¦   1.67%                  ¦ 94          ¦
+---------------------------------------------------------------------+
¦ iMemoized     ¦ 9,893,933  ¦   0.53%                  ¦ 93          ¦
+---------------------------------------------------------------------+
¦ memoizerific  ¦ 5,214,455  ¦   1.49%                  ¦ 89          ¦
+---------------------------------------------------------------------+
¦ addy-osmani   ¦ 3,331,201  ¦   0.81%                  ¦ 94          ¦
+---------------------------------------------------------------------+
¦ fast-memoize  ¦ 1,370,977  ¦   1.01%                  ¦ 90          ¦
+---------------------------------------------------------------------+
```

Functions with multiple parameters that contain objects...

```
+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------+
¦ nano-memoize  ¦ 63,382,702 ¦   1.88%                  ¦ 83          ¦
+---------------------------------------------------------------------+
¦ moize         ¦ 61,349,765 ¦   1.78%                  ¦ 82          ¦
+---------------------------------------------------------------------+
¦ micro-memoize ¦ 54,322,737 ¦   4.53%                  ¦ 72          ¦
+---------------------------------------------------------------------+
¦ lru-memoize   ¦ 23,824,559 ¦   2.34%                  ¦ 81          ¦
+---------------------------------------------------------------------+
¦ memoizee      ¦ 11,161,431 ¦   1.97%                  ¦ 84          ¦
+---------------------------------------------------------------------+
¦ memoizerific  ¦ 5,416,184  ¦   3.89%                  ¦ 79          ¦
+---------------------------------------------------------------------+
¦ addy-osmani   ¦ 1,199,529  ¦   2.78%                  ¦ 84          ¦
+---------------------------------------------------------------------+
¦ fast-memoize  ¦ 1,057,876  ¦   1.75%                  ¦ 83          ¦
+---------------------------------------------------------------------+
```

Deep equals ...

```
+---------------------------------------------------------------------------------------------------------+
¦ Name                                              ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------------------------------------------+
¦ nanomemoize deep equals (lodash isEqual)          ¦ 66,440,153 ¦   2.02%                  ¦ 92          ¦
+---------------------------------------------------------------------------------------------------------+
¦ nanomemoize deep equals (fast-equals deepEqual)   ¦ 53,056,118 ¦   2.48%                  ¦ 74          ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (hash-it isEqual)       ¦ 47,502,261 ¦   1.73%                  ¦ 85          ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (lodash isEqual)        ¦ 41,636,743 ¦   2.88%                  ¦ 84          ¦
+---------------------------------------------------------------------------------------------------------+
¦ micro-memoize deep equals (fast-equals deepEqual) ¦ 39,346,248 ¦   2.18%                  ¦ 85          ¦
+---------------------------------------------------------------------------------------------------------+
```


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
  // the serializer/key generator to use for single argument functions (optional, not recommended)
  // must be able to serialize objects and functions, by default a WeakMap is used internally without serializing
  serializer: function,
  // the equals function to use for multi-argument functions (optional, try to avoid) e.g. deepEquals for objects
  equals: function, 
  // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
  vargs: boolean 
}
```

To clear the cache you can call `.clear()` on the function returned my `nanomemoize`.

# Release History (reverse chronological order)

2019-06-28 v1.1.5 Improved documentation. Updated version of `micro-memoize` used for benchmark testing. No code changes.

2019-05-31 v1.1.4 [Fixed Issue 7](https://github.com/anywhichway/nano-memoize/issues/7).

2019-04-09 v1.1.3 [Fixed Issue 6](https://github.com/anywhichway/nano-memoize/issues/6). Minor speed and size improvements.

2019-04-02 v1.1.2 Speed improvements for multiple arguments. Now consistently faster than `fast-memoize` and `nano-memoize` across multiple test runs. Benchmarks run in a new test environment. The benchmarks for v1.1.1 although correct from a relative perspective, grossly understated actual performance due to a corrupt testing environment.

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

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

During development we also discovered that despite its popularity and goal to be the fastest possible memoizer, `fast-memoize` is actually one of the slowest out-of-the-box when it comes to multiple argument functions because it uses `JSON.stringify` to generate a single key generator for all arguments. It also only memoizes out to 3 arguments, which may cause issues. This is not to say it should not be used, it also seems to have the cleanest software architecture and it may be theoretically possible to write a high-speed multi-argument plugin. And, MANY people are very happy with it.

Special appreciation to @titoBouzout and @popbee who spent a good bit of time reviewing code for optimization and making recommendations. See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4) for the conversation.

The minified/brotli size is 654 bytes for `nano-memoize` v1.1.3 vs 1,356 bytes for `micro-memoize` v3.0.1. And, `nano-memoize` has slightly more functionality.

The speed tests are below.
 
 * For single primitive argument functions it is typically 5-10% faster than `fast-memoize` and 3x faster than `micro-memoize`.
 
 * For single object argument functions it is typically 10-15% faster than `fast-memoize` and 15-20% faster than `micro-memoize`.
 
 * For multiple primitive argument functions `nano-memoize` and `micro-memoize` will trade-off first position across multiple test runs with `nano-memoize` winning slightly more frequently. They are 60x faster than `fast-memoize`.

 * For multiple object argument functions `nano-memoize` and `micro-memoize` will trade-off first position across multiple test runs with `nano-memoize` winning slightly more frequently. They are 60x faster than `fast-memoize`.
 
 * When `deepEquals` tests are used, `micro-memoize` rules the day. 

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 Pro 64bit 1.8ghz i7 machine with 16GB RAM and Node v11.6.0. Also, even with multiple samplings, garbage collection can have a substative impact and multiple runs in different orders are really required for apples-to-apples comparisons.

Functions with a single primitive parameter...

```
+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+----------------------------------------------------------------------+
¦ nano-memoize  ¦ 408,626,233 ¦ ± 1.86%                  ¦ 81          ¦
+----------------------------------------------------------------------+
¦ fast-memoize  ¦ 368,639,842 ¦ ± 1.79%                  ¦ 81          ¦
+----------------------------------------------------------------------+
¦ micro-memoize ¦ 102,964,021 ¦ ± 1.39%                  ¦ 84          ¦
+----------------------------------------------------------------------+
¦ moize         ¦ 93,623,511  ¦ ± 1.70%                  ¦ 83          ¦
+----------------------------------------------------------------------+
¦ iMemoized     ¦ 83,667,946  ¦ ± 1.58%                  ¦ 83          ¦
+----------------------------------------------------------------------+
¦ lru-memoize   ¦ 71,258,447  ¦ ± 1.90%                  ¦ 82          ¦
+----------------------------------------------------------------------+
¦ lodash        ¦ 46,706,263  ¦ ± 1.87%                  ¦ 82          ¦
+----------------------------------------------------------------------+
¦ memoizee      ¦ 36,960,053  ¦ ± 1.67%                  ¦ 81          ¦
+----------------------------------------------------------------------+
¦ underscore    ¦ 34,650,172  ¦ ± 1.67%                  ¦ 79          ¦
+----------------------------------------------------------------------+
¦ memoizerific  ¦ 6,854,333   ¦ ± 2.14%                  ¦ 79          ¦
+----------------------------------------------------------------------+
¦ addy-osmani   ¦ 6,076,478   ¦ ± 1.80%                  ¦ 80          ¦
+----------------------------------------------------------------------+
```

Functions with a single object parameter...

```
+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+----------------------------------------------------------------------+
¦ nano-memoize  ¦ 120,054,209 ¦ ± 1.77%                  ¦ 86          ¦
+----------------------------------------------------------------------+
¦ micro-memoize ¦ 88,968,257  ¦ ± 1.13%                  ¦ 84          ¦
+----------------------------------------------------------------------+
¦ moize         ¦ 85,218,895  ¦ ± 1.42%                  ¦ 84          ¦
+----------------------------------------------------------------------+
¦ fast-memoize  ¦ 73,730,097  ¦ ± 5.40%                  ¦ 71          ¦
+----------------------------------------------------------------------+
¦ iMemoized     ¦ 58,513,510  ¦ ± 1.26%                  ¦ 80          ¦
+----------------------------------------------------------------------+
¦ lodash        ¦ 46,264,060  ¦ ± 1.88%                  ¦ 80          ¦
+----------------------------------------------------------------------+
¦ lru-memoize   ¦ 30,648,600  ¦ ± 1.61%                  ¦ 81          ¦
+----------------------------------------------------------------------+
¦ underscore    ¦ 28,901,663  ¦ ± 2.98%                  ¦ 75          ¦
+----------------------------------------------------------------------+
¦ memoizee      ¦ 17,213,563  ¦ ± 1.68%                  ¦ 80          ¦
+----------------------------------------------------------------------+
¦ addy-osmani   ¦ 6,379,759   ¦ ± 1.75%                  ¦ 81          ¦
+----------------------------------------------------------------------+
¦ memoizerific  ¦ 5,789,710   ¦ ± 3.67%                  ¦ 74          ¦
+----------------------------------------------------------------------+
```

Functions with multiple parameters that contain only primitives...

```
+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------+
¦ nano-memoize  ¦ 64,477,579 ¦ ± 1.77%                  ¦ 83          ¦
+---------------------------------------------------------------------+
¦ moize         ¦ 56,501,764 ¦ ± 2.20%                  ¦ 79          ¦
+---------------------------------------------------------------------+
¦ micro-memoize ¦ 39,469,612 ¦ ± 6.47%                  ¦ 72          ¦
+---------------------------------------------------------------------+
¦ lru-memoize   ¦ 19,361,408 ¦ ± 6.19%                  ¦ 70          ¦
+---------------------------------------------------------------------+
¦ memoizee      ¦ 11,381,474 ¦ ± 4.35%                  ¦ 73          ¦
+---------------------------------------------------------------------+
¦ iMemoized     ¦ 5,733,044  ¦ ± 9.82%                  ¦ 71          ¦
+---------------------------------------------------------------------+
¦ addy-osmani   ¦ 3,258,073  ¦ ± 2.34%                  ¦ 86          ¦
+---------------------------------------------------------------------+
¦ memoizerific  ¦ 1,965,125  ¦ ± 7.60%                  ¦ 64          ¦
+---------------------------------------------------------------------+
¦ fast-memoize  ¦ 834,173    ¦ ± 7.38%                  ¦ 65          ¦
+---------------------------------------------------------------------+
```

Functions with multiple parameters that contain objects...

```
+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------------------------+
¦ nano-memoize  ¦ 63,382,702 ¦ ± 1.88%                  ¦ 83          ¦
+---------------------------------------------------------------------+
¦ moize         ¦ 61,349,765 ¦ ± 1.78%                  ¦ 82          ¦
+---------------------------------------------------------------------+
¦ micro-memoize ¦ 54,322,737 ¦ ± 4.53%                  ¦ 72          ¦
+---------------------------------------------------------------------+
¦ lru-memoize   ¦ 23,824,559 ¦ ± 2.34%                  ¦ 81          ¦
+---------------------------------------------------------------------+
¦ memoizee      ¦ 11,161,431 ¦ ± 1.97%                  ¦ 84          ¦
+---------------------------------------------------------------------+
¦ memoizerific  ¦ 5,416,184  ¦ ± 3.89%                  ¦ 79          ¦
+---------------------------------------------------------------------+
¦ addy-osmani   ¦ 1,199,529  ¦ ± 2.78%                  ¦ 84          ¦
+---------------------------------------------------------------------+
¦ fast-memoize  ¦ 1,057,876  ¦ ± 1.75%                  ¦ 83          ¦
+---------------------------------------------------------------------+
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

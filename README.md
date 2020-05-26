[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. 
We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and 
smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of 
[moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just 
merged the best ideas in both and eliminated excess code.

During development we also discovered that despite its popularity and goal to be the fastest possible memoizer, `fast-memoize` is 
actually one of the slowest out-of-the-box when it comes to multiple argument functions because it uses `JSON.stringify` to generate 
a single key generator for all arguments. It also only memoizes out to 3 arguments, which may cause issues. This is not to say it 
should not be used, it also seems to have the cleanest software architecture and it may be theoretically possible to write a high-speed 
multi-argument plugin. And, MANY people are very happy with it.

Special appreciation to @titoBouzout and @popbee who spent a good bit of time reviewing code for optimization and making recommendations. 
See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4) for the conversation.

The minified/brotli size is 780 bytes for `nano-memoize` v1.1.5 vs 1,356 bytes for `micro-memoize` v4.08. And, `nano-memoize` has 
slightly more functionality.

The speed tests are below. At the time of testing the most recent version of `fast-memoize` 2.5.1 was a year old. The most recent 
version of `micro-memoize` 4.0.8 was 3 months old.
 
 * For single primitive argument functions `nano-memoize` is typically 20% faster than `fast-memoize` and is almost 2x faster than `micro-memoize`.
 
 * For single object argument functions `nano-memoize` is typically 30% faster than `fast-memoize` and 2x faster than `micro-memoize`.
 
 * For multiple primitive argument functions `nano-memoize` is typically 10% faster than `micro-memoize`. They are 40x faster than `fast-memoize`.

 * For multiple object argument functions `nano-memoize` is typically 10% faster than  `micro-memoize`. They are 40x faster than `fast-memoize`.
 
 * When `deepEquals` tests are used, `nano-memoize` is typically 5-10% faster than micro-memoize.

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 
Pro 64bit 1.8ghz i7 machine with 16GB RAM and Node v12.7.0. Also, even with multiple samplings, garbage collection can have a substative 
impact and multiple runs in different orders are really required for apples-to-apples comparisons.

Functions with a single primitive parameter...

```
+----------------------------------------------------------------------+
� Name          � Ops / sec   � Relative margin of error � Sample size �
+----------------------------------------------------------------------+
� nano-memoize  � 111,079,216 � � 2.37%                  � 78          �
+----------------------------------------------------------------------+
� fast-memoize  � 65,479,705  � � 3.34%                  � 75          �
+----------------------------------------------------------------------+
� iMemoized     � 62,291,787  � � 2.52%                  � 77          �
+----------------------------------------------------------------------+
� lru-memoize   � 60,937,690  � � 2.60%                  � 82          �
+----------------------------------------------------------------------+
� micro-memoize � 55,728,952  � � 2.81%                  � 77          �
+----------------------------------------------------------------------+
� moize         � 53,819,146  � � 2.37%                  � 78          �
+----------------------------------------------------------------------+
� lodash        � 33,465,668  � � 1.62%                  � 83          �
+----------------------------------------------------------------------+
� underscore    � 29,056,353  � � 1.88%                  � 79          �
+----------------------------------------------------------------------+
� memoizee      � 26,065,006  � � 1.84%                  � 82          �
+----------------------------------------------------------------------+
� addy-osmani   � 13,832,042  � � 1.60%                  � 85          �
+----------------------------------------------------------------------+
� memoizerific  � 8,427,361   � � 1.91%                  � 82          �
+----------------------------------------------------------------------+
```

Functions with a single object parameter...

```
+---------------------------------------------------------------------+
� Name          � Ops / sec  � Relative margin of error � Sample size �
+---------------------------------------------------------------------+
� nano-memoize  � 46,495,146 � � 1.97%                  � 80          �
+---------------------------------------------------------------------+
� micro-memoize � 43,077,944 � � 2.09%                  � 81          �
+---------------------------------------------------------------------+
� moize         � 42,777,883 � � 2.78%                  � 77          �
+---------------------------------------------------------------------+
� lru-memoize   � 37,611,410 � � 1.79%                  � 82          �
+---------------------------------------------------------------------+
� memoizee      � 17,154,216 � � 2.01%                  � 79          �
+---------------------------------------------------------------------+
� iMemoized     � 10,634,931 � � 1.49%                  � 87          �
+---------------------------------------------------------------------+
� memoizerific  � 6,097,165  � � 1.87%                  � 79          �
+---------------------------------------------------------------------+
� addy-osmani   � 5,582,986  � � 2.31%                  � 79          �
+---------------------------------------------------------------------+
� fast-memoize  � 1,218,211  � � 1.75%                  � 84          �
+----------------------------------------------------------------------+
```

Functions with multiple parameters that contain only primitives...

```
+---------------------------------------------------------------------+
� Name          � Ops / sec  � Relative margin of error � Sample size �
+---------------------------------------------------------------------+
� nano-memoize  � 46,495,146 � � 1.97%                  � 80          �
+---------------------------------------------------------------------+
� micro-memoize � 43,077,944 � � 2.09%                  � 81          �
+---------------------------------------------------------------------+
� moize         � 42,777,883 � � 2.78%                  � 77          �
+---------------------------------------------------------------------+
� lru-memoize   � 37,611,410 � � 1.79%                  � 82          �
+---------------------------------------------------------------------+
� memoizee      � 17,154,216 � � 2.01%                  � 79          �
+---------------------------------------------------------------------+
� iMemoized     � 10,634,931 � � 1.49%                  � 87          �
+---------------------------------------------------------------------+
� memoizerific  � 6,097,165  � � 1.87%                  � 79          �
+---------------------------------------------------------------------+
� addy-osmani   � 5,582,986  � � 2.31%                  � 79          �
+---------------------------------------------------------------------+
� fast-memoize  � 1,218,211  � � 1.75%                  � 84          �
+---------------------------------------------------------------------+
```

Functions with multiple parameters that contain objects...

```
+---------------------------------------------------------------------+
� Name          � Ops / sec  � Relative margin of error � Sample size �
+---------------------------------------------------------------------+
� nano-memoize  � 48,155,435 � � 2.54%                  � 78          �
+---------------------------------------------------------------------+
� moize         � 40,315,112 � � 2.07%                  � 78          �
+---------------------------------------------------------------------+
� micro-memoize � 39,886,911 � � 2.40%                  � 80          �
+---------------------------------------------------------------------+
� lru-memoize   � 36,058,456 � � 2.57%                  � 79          �
+---------------------------------------------------------------------+
� memoizee      � 15,785,666 � � 3.43%                  � 81          �
+---------------------------------------------------------------------+
� memoizerific  � 6,107,157  � � 2.99%                  � 81          �
+---------------------------------------------------------------------+
� addy-osmani   � 1,712,749  � � 3.02%                  � 83          �
+---------------------------------------------------------------------+
� fast-memoize  � 775,548    � � 3.24%                  � 80          �
+---------------------------------------------------------------------+
```

Deep equals ...

```
+---------------------------------------------------------------------------------------------------------+
� Name                                              � Ops / sec  � Relative margin of error � Sample size �
+---------------------------------------------------------------------------------------------------------+
� nanomemoize deep equals (lodash isEqual)          � 61,286,418 � � 2.01%                  � 80          �
+---------------------------------------------------------------------------------------------------------+
� nanomemoize deep equals (hash-it isEqual)         � 61,085,147 � � 4.10%                  � 77          �
+---------------------------------------------------------------------------------------------------------+
� micro-memoize deep equals (lodash isEqual)        � 57,944,413 � � 3.21%                  � 79          �
+---------------------------------------------------------------------------------------------------------+
� micro-memoize deep equals (hash-it isEqual)       � 54,368,987 � � 2.66%                  � 81          �
+---------------------------------------------------------------------------------------------------------+
� nanomemoize deep equals (fast-equals deepEqual)   � 50,030,425 � � 3.39%                  � 76          �
+---------------------------------------------------------------------------------------------------------+
� micro-memoize deep equals (fast-equals deepEqual) � 41,445,170 � � 2.84%                  � 76          �
+---------------------------------------------------------------------------------------------------------+
```


# Usage

`npm install nano-memoize`

Use the code in the [`browser`](browser/) directory for the browser

The code is hand-crafted to run across all browsers all the way back to IE 11. No transpiling is necessary.


# API

The API is a subset of the `moize` API.

```javascript
const memoized = nanomemoize(sum(a,b) => a + b);
memoized(1,2); // 3
memoized(1,2); // pulled from cache
```

`nanomemoize(function,options) returns function`

The shape of options is:

```javascript
{
  // only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
  maxArgs: number, 
  // number of milliseconds to cache a result, set to `Infinity` or `-1` to never create timers or expire
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

2020-05-26 v1.1.11 [Fixed Issue 17]Fixed https://github.com/anywhichway/nano-memoize/issues/17. It is not known when this bug made its way into the code.

2020-02-30 v1.1.10 Moved growl to dev dependency.

2020-01-30 v1.1.9 Code style improvements.

2019-11-29 v1.1.8 Corrected typos in documentation.

2019-09-25 v1.1.7 Manually created an IE 11 compatible version by removing arrow functions and replacing Object.assign
with a custom function. Minor size increase from 660 to 780 Brotli bytes. Also eliminated complex `bind` approach in
favor of closures. The latest v8 engine handles closures as fast as bound arguments for our case and we are not as
concerned with older browser performace (particularly given how fast the code is anyway). Converted for loops to run in
reverse, which for our case is faster (but is not always guranteed to be faster).

2019-09-17 v1.1.6 Added a manually transpiled es5_ie11.html file with an Object.assign polyfill to the test directory to verify
compatibility with IE11. Modified unit tests so they are ES5 compatible. All tests pass. Added `sideEffects=false` to package.json.

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

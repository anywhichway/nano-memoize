[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade) [![](https://img.shields.io/npm/v/nano-memoize.svg?style=flat)](https://www.npmjs.org/package/nano-memoize) [![](https://img.shields.io/npm/dm/nano-memoize.svg)](https://www.npmjs.org/package/nano-memoize) [![](https://img.shields.io/bundlephobia/minzip/nano-memoize.svg)](https://bundlephobia.com/package/nano-memoize) [![](https://packagephobia.com/badge?p=nano-memoize)](https://packagephobia.com/result?p=nano-memoize)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

Version 3.x.x of nano-memoize was modified to use newer versions of JavaScript built-in classes and take advantage of current v8 loop optimizations. As a result, the minified/brotli size of 3.0.4 at 487 bytes is 30% smaller and is slightly faster that v2.x.x and v1.x.x. 

The `nano-memoize` library although very small and very fast, is no longer the smallest or fastest JavaScript memoizer. Although it lacks some configuration options, the [memize](https://github.com/aduth/memize) library is the smallest and fastest JavaScript memoizer. In fact, `memize` has been around for some time, I just did not know about it.

# Usage

`npm install nano-memoize`

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
  // call last argument of memoized multi-args functions after a number of milliseconds via a timeout after the 
  // cached result has been returned, perhaps to ensure that callbacks are invoked, does not cache the timemout result
  // e.g. nanomemoize(function(a,b,callback) { var result = a + b; callback(result); return result; },{maxArgs:2,callTimeout:0});
  callTimeout: number,
  // number of milliseconds to cache a result, set to `Infinity` or `-1` to never create timers or expire
  maxAge: number, 
  // the serializer/key generator to use for single argument functions (optional, not recommended)
  // must be able to serialize objects and functions, by default a Map is used internally without serializing
  serializer: function,
  // the equals function to use for multi-argument functions (optional, try to avoid) e.g. deepEquals for objects
  equals: function, 
  // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
  vargs: boolean 
}
```

The returned function will also have these methods:

`.clear()` clears the cache for the function.

`.keys()` returns an array of arrays with each array being the arguments provided on a call of the function.

`.values()` returns an array of values with each array being the results of a function call with the same index position as the keys.

# Benchmarks

Tests no-longer show `nano-memoize` is the smallest and fastest JavaScript memoizer for single and multiple argument functions accepting primitives and objects.

Although it lacks some configuration options, the [memize](https://github.com/aduth/memize) library is the smallest and fastest JavaScript memoizer.

Although `fast-memoize` used to be a contender and is hugely popular, its performance has dropped substantially.

`lodash` is excluded from multiple argument tests because it only memoizes the first argument.

Benchmarks can vary dramatically from O/S to O/S or Node version to Node version or even execution run to execution run. These tests were run on a Windows 10 Pro 64bit 2.8ghz i7 machine with 16GB RAM and Node v18.13.0. Garbage collection was forced between each sample run to minimize its impact on results.

Starting cycles for functions with a single primitive parameter...

| Name          |  Ops / sec   | Relative margin of error | Sample size |
|---------------|------- |-------------------------|-------------|
| nano-memoize   |  177,773,071  | ± 1.17%               | 87          | 
| fast-memoize  |  148,920,057 | ± 1.37%                 | 88          |
| micro-memoize |  148,405,982 | ± 1.46%                 | 90          |
| memize        |  135,435,506 | ± 2.60%                 | 82          | 
| iMemoized     |  117,844,380 | ± 1.65%                 | 88          |
| moize         |  96,796,008  | ± 1.80%                 | 85          |
| underscore    |  54,815,804  | ± 1.28%                 | 87          |
| lodash        |  54,617,110  | ± 1.30%                 | 87          |
| lru-memoize   |  41,426,130  | ± 1.16%                 | 87          |
| memoizee      |  31,747,590  | ± 1.52%                 | 85          |
| addy-osmani   |  14,848,551  | ± 1.76%                 | 82          |
| memoizerific  |  12,835,863  | ± 1.84%                 | 85          | 


Starting cycles for functions with a single object parameter...

|  Name          |  Ops / sec   |  Relative margin of error |  Sample size | 
| ------- |------- |------------- |------- |
 |  nano-memoize   |  105,666,095  |  ± 1.84%                   |  84           | 
 |  memize         |  100,137,512  |  ± 3.52%                   |  78           | 
 |  micro-memoize  |  81,031,228   |  ± 1.85%                   |  82           | 
 |  moize          |  80,331,910   |  ± 1.88%                   |  84           | 
 |  lodash         |  57,681,325   |  ± 3.58%                   |  77           | 
 |  iMemoized      |  31,021,746   |  ± 2.16%                   |  82           | 
 |  lru-memoize    |  27,346,729   |  ± 3.08%                   |  73           | 
 |  memoizee       |  26,171,811   |  ± 2.85%                   |  79           | 
 |  memoizerific   |  12,116,210   |  ± 2.31%                   |  82           | 
 |  underscore     |  11,796,099   |  ± 2.54%                   |  81           | 
 |  addy-osmani    |  1,333,797    |  ± 1.93%                   |  82           | 
 |  fast-memoize   |  1,046,331    |  ± 2.41%                   |  81           | 


Starting cycles for functions with multiple parameters that contain only primitives...

|  Name          |  Ops / sec  |  Relative margin of error |  Sample size | 
| ------- |------- |------------- |------- |
 |  memize         |  92,754,248  |  ± 2.04%                   |  80           | 
 |  nano-memoize   |  73,566,138  |  ± 2.45%                   |  83           | 
 |  moize          |  62,359,029  |  ± 3.22%                   |  77           | 
 |  micro-memoize  |  60,110,589  |  ± 2.94%                   |  77           |
 |  lru-memoize    |  31,263,360  |  ± 2.08%                   |  84           |
 |  memoizee       |  17,110,335  |  ± 3.01%                   |  76           |
 |  iMemoized      |  10,532,281  |  ± 2.83%                   |  79           |
 |  memoizerific   |  8,042,920   |  ± 3.18%                   |  77           |
 |  addy-osmani    |  3,942,524   |  ± 3.38%                   |  79           |
 |  fast-memoize   |  1,076,636   |  ± 3.09%                   |  80           | 


Starting cycles for functions with multiple parameters that contain objects...

|  Name          |  Ops / sec  |  Relative margin of error |  Sample size |
| ------- |------- |------------- |------- |
 |  memize         |  67,190,875  |  ± 3.73%                   |  70           |
 |  nano-memoize   |  49,960,425  |  ± 2.25%                   |  81           | 
 |  micro-memoize  |  47,635,797  |  ± 3.70%                   |  73           | 
 |  moize          |  44,910,757  |  ± 4.52%                   |  68           | 
 |  lru-memoize    |  27,472,119  |  ± 2.76%                   |  77           | 
 |  memoizee       |  17,352,541  |  ± 2.79%                   |  75           | 
 |  underscore     |  10,748,866  |  ± 3.62%                   |  74           | 
 |  iMemoized      |  10,544,215  |  ± 2.77%                   |  77           | 
 |  memoizerific   |  8,346,696   |  ± 3.66%                   |  74           | 
 |  addy-osmani    |  954,701     |  ± 2.18%                   |  82           | 
 |  fast-memoize   |  652,447     |  ± 3.60%                   |  74           | 

Starting cycles for alternative cache types...

|  Name                                        |  Ops / sec   |  Relative margin of error |  Sample size |
| ------- |------- |------------- |------- |
|  nanomemoize deep equals (hash-it isEqual)   |  107,990,728 |  ± 2.59%                  |  83          | 
|  nanomemoize deep equals (lodash isEqual)    |  96,543,576  |  ± 2.20%                  |  84          | 
|  moize deep equals (lodash isEqual)          |  88,305,997  |  ± 2.55%                  |  82          | 
|  micro-memoize deep equals (fast-equals)     |  86,511,616  |  ± 1.67%                  |  85          | 
|  moize deep equals (fast-deep-equal)         |  85,948,355  |  ± 1.55%                  |  79          | 
|  micro-memoize deep equals (lodash isEqual)  |  85,231,542  |  ± 1.83%                  |  84          | 
|  moize deep equals (fast-equals)             |  84,844,833  |  ± 1.77%                  |  85          | 
|  moize deep equals (hash-it isEqual)         |  76,605,158  |  ± 1.82%                  |  83          | 
|  micro-memoize deep equals (hash-it isEqual) |  73,619,713  |  ± 2.26%                  |  82          | 
|  nanomemoize fast equals (fast-equals deep)  |  64,710,177  |  ± 1.59%                  |  79          | 
|  micro-memoize deep equals (fast-deep-equal) |  62,658,012  |  ± 2.95%                  |  78          | 
|  nanomemoize fast equals (fast-deep-equals)  |  42,443,623  |  ± 1.91%                  |  82          | 


Most libraries test repeated calls using the same arguments that guarantee memoized cache hits. In the real world this is unlikely. For a real world simulation where only 20% of the function calls are memoized and they take and return mixed argument types, nanomemoize is by far fastest.

Note, the reasons for the slow performance of `memize` below are unknown. It is possible that the library is not being used correctly. Also, it is known that the library is optimized for repeated calls with the same arguments in a series rather than sporadically. If your usage pattern is more similar to the simulation, you should test `memize` further.

Starting real world simulation...

| Name                   | Ops / sec | Relative margin of error | Sample size |
| ------- |------- |------------- |------- |
|  nanomemoizedFunctions    |  2,172,477  |  ± 2.63%                   |  81           | 
|  moizeMemoizedFunctions   |  1,279,591  |  ± 2.30%                   |  83           | 
|  microMemoizedFunctions   |  1,206,613  |  ± 2.62%                   |  81           | 
|  fastMemoizedFunctions    |  441,783    |  ± 2.94%                   |  79           | 
|  memizeMemoizedFunctions  |  3,727      |  ± 34.45%                  |  9            | 


If you want similar performance for intersection, union or Cartesian product also see:

- https://github.com/anywhichway/intersector
- https://github.com/anywhichway/unionizor
- https://github.com/anywhichway/cxproduct

 For a complete high performance solution to Cartesian product and set operations for Arrays and Sets with a standardized API, plus the addition of the standard map/reduce/find operations to Set see:

- https://github.com/anywhichway/array-set-ops


# Release History (reverse chronological order)

2023-11-16 v3.0.16 Fixed issue [63](https://github.com/anywhichway/nano-memoize/issues/63). Thanks @darkship.

2023-11-16 v3.0.15 Enhanced TypeScript types. Thanks @darkship.

2023-09-29 v3.0.14 Added Typescript typings to `package.json` (thanks @gnarea) and some badges (thanks @silverwind).

2023-06-17 v3.0.13 Corrected version below which was set to v4.0.0. Minor optimizations. Restructured README to put usage above benchmarks.

2023-06-16 v3.0.12 Bumping version for updates of dependencies. Updated all memoization libraries to latest versions. Also added `memize` to tests and updated to latest LTS version of Node.js. The Node update had a material impact on performance of several memoziation libraries.

2023-04-19 v3.0.11 Bumping version for dependabot and other third party pull requests impacting package.json.

2023-04-08 v3.0.10 Enhanced real world simulation.

2023-04-07 v3.0.9 Added real world simulation. Removed .parcel-cache from deployment.

2023-02-22 v3.0.8 Documentation updates.

2023-02-15 v3.0.7 Documentation updates.

2023-02-15 v3.0.6 Documentation updates.

2023-02-15 v3.0.5 Documentation updates.

2023-02-04 v3.0.4 A code walkthrough revealed an opportunity to remove unused code from v2.x.x.

2023-02-02 v3.0.3 Added unit test for `maxAge`. Adjusted varArg unit tests for more accuracy. Slight optimizations to multi argument memoized functions. Slight improvement to cache clearing that may reduce GC. Updated license file for copyright period. Updated docs on `callTimeout` for clarity.

2023-02-01 v3.0.2 Fixed https://github.com/anywhichway/nano-memoize/issues/52 with custom equals functions not consistently working. `fast-equals` or `lodash.isEqual` now work. Slight performance degradation, but still generally the fastest.

2022-01-29 v3.0.1 Fixed build issue where root index.js was not getting updated.

2023-01-28 v3.0.0 Slight size optimization. 25% speed improvement. Moved to module format. There is a known issue with providing `fast-equals` or `lodash.isEqual` as an optional comparison function. Unit tests pass, but the functions fail under load. The `hash-it` object equivalence function does work. A formerly undocumented method `.keyValues()` has been deprecated since it is no longer relevant with the new optimizations.

2022-12-08 v2.0.0 Removed callTimeout from TypeScript typings since it was not implemented and there are no plans to implement. Bumped version to 2.0.0 since this may break some users.

2022-10-20 v1.3.1 Bumping version for https://github.com/anywhichway/nano-memoize/pull/41

2022-03-30 v1.3.0 Dropped support for `dist` and `browser` directories.

2022-03-15 v1.2.2 Bumped minor version for TS typings and some package dependency updates.

2020-11-02 v1.2.1 Added main: "index.js" reference in package.json.

2020-06-18 v1.2.0 Enhanced multi-arg handling so that arg lengths must match precisely (thanks @amazingmarvin), unless `maxArgs` is passed as an option.
Also added `callTimeout` to go ahead and call underlying function to ensure callbacks are invoked if necessary.

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

2019-02-16 v1.0.1 Memo expiration optimization. Special appreciation to @titoBouzout and @popbee who spent a good bit of time reviewing code for optimization and making recommendations. See [Issue 4](https://github.com/anywhichway/nano-memoize/issues/4) for the conversation.

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

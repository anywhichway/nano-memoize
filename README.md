# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fastmemoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micromemoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

The minified/gzipped size is 918 bytes for `nano-memoize` vs 959 bytes for `micro-memoize`.

The speed tests are below.

`fast-memoize` is only the fastest in one case, single argument functions taking an object. However, in the case of a single primitve argument `nano-memoize` is 240% faster and in all other cases even better than that.

`micro-memoize` is faster than `fast-memoize` except for single argument functions.

`nano-memoize` is always faster than `moize`.

`nano-memoize` and `fast-memoize` are comparable for multiple-argument functions. `fast-memoize` is always the slowest for these.

We have found that benchmarks can vary dramartically from O/S to O/S or node version to node version. These tests were run on a Windows 10 64bit 2.4gx machine with 8GB RAM and Node v9.4.0. 

Functions with a single primitive parameter...


| Name          | Ops / sec   | Relative margin of error | Sample size |
|---------------|-------------|--------------------------|-------------|
| nano-memoize  | 183,478,889 |   0.55%                  | 90          |
| fast-memoize  | 75,218,544  |   2.21%                  | 81          |
| micro-memoize | 26,565,887  |   1.48%                  | 79          |
| moize         | 22,047,750  |   0.48%                  | 86          |



Functions with a single object parameter...



| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| fast-memoize  | 78,297,395 |   0.54%                  | 90          |
| nano-memoize  | 57,453,837 |   2.03%                  | 86          |
| micro-memoize | 26,615,102 |   0.40%                  | 91          |
| moize         | 21,760,403 |   0.53%                  | 84          |


Functions with multiple parameters that contain only primitives...

| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| nanomemoize   | 18,280,535 |   1.45%                  | 83          |
| micro-memoize | 16,394,987 |   0.95%                  | 86          |
| moize         | 13,921,400 |   0.93%                  | 87          |
| fast-memoize  | 884,771    |   0.47%                  | 94          |



Functions with multiple parameters that contain objects...

| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| micro-memoize | 16,244,817 |   0.86%                  | 89          |
| nanomemoize   | 14,362,298 |   1.89%                  | 89          |
| moize         | 14,123,028 |   0.62%                  | 88          |
| fast-memoize  | 682,549    |   0.49%                  | 90          |


Deep equals ...



| Name                                              | Ops / sec  | Relative margin of error | Sample size |
|---------------------------------------------------|------------|--------------------------|-------------|
| micro-memoize deep equals (hash-it isEqual)       | 18,894,707 |   0.86%                  | 91          |
| nanomemoize deep equals (lodash isEqual)          | 18,504,364 |   0.85%                  | 90          |
| micro-memoize deep equals (fast-equals deepEqual) | 16,302,930 |   0.73%                  | 87          |
| nanomemoize deep equals (fast-equals deepEqual)   | 15,162,874 |   0.83%                  | 89          |
                 

We were puzzled about the multiple argument performance on `fast-memoize` given its stated goal of being the "fastest possible". We discovered that the default caching and serialization approach used by fast-memoize only performs well for single argument functions for two reasons:

1) It uses `JSON.stringify` to create a key for an entire argument list. This can be slow.

2) Because a single key is generated for all arguments when perhaps only the first argument differs in a call, a lot of extra work is done. The `moize` and `micro-memoize` approach adopted by `nano-memoize` is far faster for multiple arguments.

Along the way we also discovered that fast-memoize is subject to a key generation risk on edge case functions and fixed the flaw. The fork is [here](https://github.com/anywhichway/fastmemoize.js). We have submitted a pull request. See this [Medium article](https://codeburst.io/akeytokeyswhenjavascriptkeysdontmatchab44c81adc87) for details. 


# Usage

nmp install nano-memoize

use the code in the `browser` directory for the browser

Since most devs are running a build pipeline, the code is not transpiled, although it is browserified


# API

The API is a subset of the `moize` API.

```javascript
const memoized = micromemoize(sum(a,b) => a + b);
memoized(1,2); // 3
memoized(1,2); // pulled from cache
```

`memoized(function,options) returns function`

The shape of options is:

```javascript
{
  maxArgs: number, // only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
  maxAge: number, // number of milliseconds to cache a result
  serializer: function, // the serializer/key generator to use for single argument functions (multi-argument functions do not use a serializer)
  equals: function, // the equals function to use for multi-argument functions, e.g. deepEquals for objects (single-argument functions use serializer not equals)
  vargs: boolean // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
}
```

# Release History (reverse chronological order)

2018-01-27 v0.0.6b  BETA Minor size and speed improvements.

2018-01-27 v0.0.5b  BETA Fixed edge case where multi-arg key may be shorter than current args.

2018-01-27 v0.0.4b  BETA Fixed benchmarks. Removed maxSize. More unit tests. Fixed maxAge.

2018-01-27 v0.0.3b  BETA More unit tests. Documentation. Benchmark code in repository not yet running.

2018-01-24 v0.0.2a  ALPHA Minor speed enhancements. Benchmark code in repository not yet running.

2018=01-24 v0.0.1a  ALPHA First public release. Benchmark code in repository not yet running.
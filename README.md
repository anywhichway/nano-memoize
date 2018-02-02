# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

The minified/gzipped size is 872 bytes for `nano-memoize` vs 959 bytes for `micro-memoize`. And, `nano-memoize` has slightly more functionality.

The speed tests are below.

`fast-memoize` is only the fastest in one case, single argument functions taking an object. However, in the case of a single primitve argument `nano-memoize` is 240% faster.
In all other cases, `fast-memoize` is the slowest of all memoizers tested. We have submitted a [pull request](https://github.com/caiogondim/fast-memoize.js/pull/65) that doubles the speed of 
fast-memoize for single primitive argument functions, but nano-memoize is still faster. When fast-memoize is updated, these benchmarks will also get updated.

`micro-memoize` is faster than `fast-memoize` except for single argument functions.

`nano-memoize` is always faster than `moize`.

`nano-memoize` and `micro-memoize` are comparable and within each others margin of error for multiple-argument functions.

We have found that benchmarks can vary dramartically from O/S to O/S or node version to node version. These tests were run on a Windows 10 64bit 2.4gx machine with 8GB RAM and Node v9.4.0. 

Functions with a single primitive parameter...


| Name          | Ops / sec   | Relative margin of error | Sample size |
|---------------|-------------|--------------------------|-------------|
| namomemoize   | 182,149,346 | ± 1.26%                  | 88          |
| fast-memoize  | 77,088,117  | ± 2.07%                  | 80          |
| iMemoized     | 28,847,308  | ± 5.33%                  | 82          |
| micro-memoize | 27,930,597  | ± 0.39%                  | 89          |
| moize         | 20,873,921  | ± 1.68%                  | 88          |
| lodash        | 15,848,140  | ± 4.94%                  | 71          |
| underscore    | 15,297,703  | ± 1.86%                  | 87          |
| memoizee      | 10,136,701  | ± 1.60%                  | 87          |
| lru-memoize   | 6,493,655   | ± 3.74%                  | 85          |
| addy-osmani   | 4,024,188   | ± 1.27%                  | 91          |
| memoizerific  | 3,678,158   | ± 3.49%                  | 82          |
| ramda         | 529,725     | ± 1.69%                  | 84          |


Functions with a single object parameter...


| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| fast-memoize  | 77,283,568 | ± 1.67%                  | 88          |
| namomemoize   | 59,424,256 | ± 1.38%                  | 89          |
| micro-memoize | 25,627,414 | ± 2.18%                  | 86          |
| lodash        | 23,679,706 | ± 0.85%                  | 88          |
| moize         | 20,995,600 | ± 1.49%                  | 86          |
| underscore    | 15,219,725 | ± 1.57%                  | 87          |
| iMemoized     | 13,955,141 | ± 0.60%                  | 88          |
| memoizee      | 8,414,326  | ± 0.71%                  | 93          |
| lru-memoize   | 5,934,247  | ± 1.88%                  | 89          |
| addy-osmani   | 4,267,758  | ± 0.47%                  | 92          |
| memoizerific  | 3,954,272  | ± 0.92%                  | 91          |
| ramda         | 836,507    | ± 0.62%                  | 91          |


Functions with multiple parameters that contain only primitives...

| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| nano-memoize  | 18,408,074 | ± 1.24%                  | 85          |
| micro-memoize | 17,310,593 | ± 1.11%                  | 85          |
| moize         | 14,457,697 | ± 0.79%                  | 90          |
| memoizee      | 7,723,320  | ± 0.54%                  | 94          |
| iMemoized     | 5,934,041  | ± 1.03%                  | 90          |
| lru-memoize   | 5,388,273  | ± 0.52%                  | 94          |
| memoizerific  | 3,206,479  | ± 0.30%                  | 93          |
| addy-osmani   | 2,397,744  | ± 0.48%                  | 93          |
| fast-memoize  | 899,483    | ± 0.37%                  | 91          |


Functions with multiple parameters that contain objects...

| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| nano-memoize  | 13,869,690 | ± 1.25%                  | 86          |
| micro-memoize | 13,192,239 | ± 3.13%                  | 78          |
| moize         | 10,895,627 | ± 3.33%                  | 71          |
| memoizee      | 5,794,981  | ± 0.83%                  | 92          |
| lru-memoize   | 5,148,065  | ± 0.44%                  | 92          |
| memoizerific  | 3,206,713  | ± 0.86%                  | 93          |
| addy-osmani   | 996,705    | ± 0.45%                  | 92          |
| fast-memoize  | 699,597    | ± 1.17%                  | 91          |


Deep equals ...


| Name                                              | Ops / sec  | Relative margin of error | Sample size |
|---------------------------------------------------|------------|--------------------------|-------------|
| nano-memoize deep equals (lodash isEqual)         | 18,024,422 | ± 1.78%                  | 83          |
| micro-memoize deep equals (lodash isEqual)        | 17,219,476 | ± 0.69%                  | 86          |
| nano-memoize deep equals (fast-equals deepEqual)  | 14,732,731 | ± 3.10%                  | 85          |
| micro-memoize deep equals (fast-equals deepEqual) | 8,785,408  | ± 11.28%                 | 51          |
| micro-memoize deep equals (hash-it isEqual)       | 5,744,080  | ± 10.69%                 | 48          |
                 

We were puzzled about the multiple argument performance on `fast-memoize` given its stated goal of being the "fastest possible". We discovered that the default caching and serialization approach used by fast-memoize only performs well for single argument functions for two reasons:

1) It uses `JSON.stringify` to create a key for an entire argument list. This can be slow.

2) Because a single key is generated for all arguments when perhaps only the first argument differs in a call, a lot of extra work is done. The `moize` and `micro-memoize` approach adopted by `nano-memoize` is far faster for multiple arguments.

Along the way we also discovered that fast-memoize is subject to a key generation risk on edge case functions and fixed the flaw. The fork is [here](https://github.com/anywhichway/fastmemoize.js). We have submitted a [pull request](https://github.com/caiogondim/fast-memoize.js/pull/65). See this [Medium article](https://codeburst.io/akeytokeyswhenjavascriptkeysdontmatchab44c81adc87) for details. 


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

2018-02-01 v0.1.0  Documentation updates. 50 byte decrease.

2018-01-27 v0.0.7b  BETA Documentation updates.

2018-01-27 v0.0.6b  BETA Minor size and speed improvements.

2018-01-27 v0.0.5b  BETA Fixed edge case where multi-arg key may be shorter than current args.

2018-01-27 v0.0.4b  BETA Fixed benchmarks. Removed maxSize. More unit tests. Fixed maxAge.

2018-01-27 v0.0.3b  BETA More unit tests. Documentation. Benchmark code in repository not yet running.

2018-01-24 v0.0.2a  ALPHA Minor speed enhancements. Benchmark code in repository not yet running.

2018=01-24 v0.0.1a  ALPHA First public release. Benchmark code in repository not yet running.
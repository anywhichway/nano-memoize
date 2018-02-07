# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

The minified/gzipped size is 872 bytes for `nano-memoize` vs 959 bytes for `micro-memoize`. And, `nano-memoize` has slightly more functionality.

The speed tests are below. `nano-memoize` is the fastest in all cases. For single argument functions is it comparable to, but slightly faster than, `fast-memoize`. For multiple argument functions it is comparable to, but slightly faster than, `micro-memoize`.

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 64bit 2.4ghz machine with 8GB RAM and Node v9.4.0. 

Functions with a single primitive parameter...


| Name          | Ops / sec   | Relative margin of error | Sample size |
|---------------|-------------|--------------------------|-------------|
| namo-memoize  | 152,526,010 | ± 2.58%                  | 80          |
| fast-memoize  | 147,683,192 | ± 2.90%                  | 85          |
| micro-memoize | 22,682,348  | ± 3.69%                  | 75          |
| iMemoized     | 22,292,411  | ± 4.47%                  | 72          |
| lodash        | 20,937,311  | ± 1.94%                  | 88          |
| moize         | 16,296,876  | ± 4.77%                  | 74          |
| memoizee      | 9,651,118   | ± 3.07%                  | 86          |
| underscore    | 9,266,277   | ± 2.66%                  | 75          |
| lru-memoize   | 6,676,849   | ± 2.93%                  | 87          |
| addy-osmani   | 3,899,834   | ± 2.27%                  | 86          |
| memoizerific  | 3,753,347   | ± 2.33%                  | 86          |
| ramda         | 493,665     | ± 1.77%                  | 88          |


Functions with a single object parameter...

| Name          | Ops / sec  | Relative margin of error | Sample size |
|---------------|------------|--------------------------|-------------|
| namo-memoize  | 53,741,011 | ± 2.06%                  | 85          |
| fast-memoize  | 51,041,370 | ± 2.40%                  | 82          |
| micro-memoize | 22,638,078 | ± 3.96%                  | 77          |
| lodash        | 22,187,376 | ± 1.72%                  | 83          |
| moize         | 19,446,817 | ± 3.32%                  | 81          |
| underscore    | 13,643,959 | ± 3.17%                  | 81          |
| iMemoized     | 11,926,976 | ± 5.90%                  | 80          |
| memoizee      | 8,010,016  | ± 1.99%                  | 83          |
| lru-memoize   | 5,709,156  | ± 1.89%                  | 89          |
| memoizerific  | 3,817,781  | ± 1.46%                  | 90          |
| addy-osmani   | 3,699,956  | ± 3.30%                  | 85          |
| ramda         | 793,756    | ± 1.92%                  | 87          |


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


# Usage

npm install nano-memoize

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
  vargs: boolean // forces the use of multi-argument paradigm, auto set if function has a spread a
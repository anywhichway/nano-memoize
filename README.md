[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30ce201484754fa5b0a6c6046abb842d)](https://www.codacy.com/app/syblackwell/nano-memoize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/nano-memoize&amp;utm_campaign=Badge_Grade)
# Faster than fast, smaller than micro ... nano-memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced great memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fastmemoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micromemoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it ... but credit to them ... we just merged the best ideas in both and eliminated excess code.

The minified/gzipped size is 887 bytes for `nano-memoize` vs 959 bytes for `micro-memoize`. And, `nano-memoize` has slightly more functionality.

The speed tests are below. In most cases `nano-memoize` is the fastest.
 
 * For single primitive argument functions it is comparable to, but slightly and probably un-importantly faster that `fast-memoize`.
 
 * For single object argument functions it is always by far the fastest.
 
 * For multiple primitive argument functions functions`nano-memoize` slightly and probably un-importantly faster than `fast-memoize`. 

 * For multiple object argument functions `fast-memoize` slightly and probably un-importantly faster. 

We have found that benchmarks can vary dramatically from O/S to O/S or Node version to Node version. These tests were run on a Windows 10 64bit 2.4ghz machine with 8GB RAM and Node v9.4.0. Also, even with multiple samplings, garbage collection can have a substative impact and multiple runs in different orders are really required for apples-to-apples comparisons.

Functions with a single primitive parameter...


+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+---------------+-------------+--------------------------+-------------¦
¦ namo-memoize  ¦ 277,174,954 ¦ ± 0.39%                  ¦ 94          ¦
+---------------+-------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 243,829,313 ¦ ± 4.97%                  ¦ 81          ¦
+---------------+-------------+--------------------------+-------------¦
¦ iMemoized     ¦ 49,406,719  ¦ ± 3.90%                  ¦ 82          ¦
+---------------+-------------+--------------------------+-------------¦
¦ micro-memoize ¦ 48,245,239  ¦ ± 2.19%                  ¦ 89          ¦
+---------------+-------------+--------------------------+-------------¦
¦ moize         ¦ 47,380,879  ¦ ± 0.59%                  ¦ 88          ¦
+---------------+-------------+--------------------------+-------------¦
¦ lru-memoize   ¦ 39,284,232  ¦ ± 4.35%                  ¦ 87          ¦
+---------------+-------------+--------------------------+-------------¦
¦ lodash        ¦ 31,464,058  ¦ ± 2.91%                  ¦ 91          ¦
+---------------+-------------+--------------------------+-------------¦
¦ memoizee      ¦ 19,406,111  ¦ ± 4.90%                  ¦ 79          ¦
+---------------+-------------+--------------------------+-------------¦
¦ underscore    ¦ 16,986,840  ¦ ± 5.83%                  ¦ 75          ¦
+---------------+-------------+--------------------------+-------------¦
¦ addy-osmani   ¦ 4,496,619   ¦ ± 0.98%                  ¦ 92          ¦
+---------------+-------------+--------------------------+-------------¦
¦ memoizerific  ¦ 2,394,952   ¦ ± 6.96%                  ¦ 49          ¦
+---------------+-------------+--------------------------+-------------¦
¦ ramda         ¦ 1,095,063   ¦ ± 2.10%                  ¦ 86          ¦
+----------------------------------------------------------------------+


Functions with a single object parameter...

+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+---------------+-------------+--------------------------+-------------¦
¦ namo-memoize  ¦ 271,647,146 ¦   0.74%                  ¦ 90          ¦
+---------------+-------------+--------------------------+-------------¦
¦ micro-memoize ¦ 44,126,430  ¦   4.22%                  ¦ 81          ¦
+---------------+-------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 44,125,722  ¦   2.14%                  ¦ 82          ¦
+---------------+-------------+--------------------------+-------------¦
¦ iMemoized     ¦ 43,981,304  ¦   1.61%                  ¦ 89          ¦
+---------------+-------------+--------------------------+-------------¦
¦ moize         ¦ 32,603,505  ¦   3.19%                  ¦ 14          ¦
+---------------+-------------+--------------------------+-------------¦
¦ lodash        ¦ 31,277,037  ¦   1.16%                  ¦ 88          ¦
+---------------+-------------+--------------------------+-------------¦
¦ underscore    ¦ 20,293,644  ¦   1.02%                  ¦ 88          ¦
+---------------+-------------+--------------------------+-------------¦
¦ memoizee      ¦ 11,533,134  ¦   1.35%                  ¦ 89          ¦
+---------------+-------------+--------------------------+-------------¦


Functions with multiple parameters that contain only primitives...

+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------+------------+--------------------------+-------------¦
¦ nano-memoize  ¦ 24,739,433 ¦   0.98%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ micro-memoize ¦ 23,131,341 ¦   3.33%                  ¦ 74          ¦
+---------------+------------+--------------------------+-------------¦
¦ moize         ¦ 20,241,359 ¦   2.45%                  ¦ 81          ¦
+---------------+------------+--------------------------+-------------¦
¦ memoizee      ¦ 9,917,821  ¦   2.58%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ lru-memoize   ¦ 7,582,999  ¦   2.85%                  ¦ 82          ¦
+---------------+------------+--------------------------+-------------¦
¦ iMemoized     ¦ 4,765,891  ¦   12.92%                 ¦ 68          ¦
+---------------+------------+--------------------------+-------------¦
¦ memoizerific  ¦ 3,200,253  ¦   3.02%                  ¦ 84          ¦
+---------------+------------+--------------------------+-------------¦
¦ addy-osmani   ¦ 2,240,692  ¦   2.28%                  ¦ 87          ¦
+---------------+------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 885,271    ¦   3.99%                  ¦ 82          ¦
+---------------------------------------------------------------------+


Functions with multiple parameters that contain objects...

+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------+------------+--------------------------+-------------¦
¦ micro-memoize ¦ 23,846,343 ¦   3.35%                  ¦ 84          ¦
+---------------+------------+--------------------------+-------------¦
¦ nano-memoize  ¦ 17,861,879 ¦   2.49%                  ¦ 84          ¦
+---------------+------------+--------------------------+-------------¦
¦ moize         ¦ 17,147,054 ¦   5.62%                  ¦ 63          ¦
+---------------+------------+--------------------------+-------------¦
¦ lru-memoize   ¦ 7,247,819  ¦   3.85%                  ¦ 81          ¦
+---------------+------------+--------------------------+-------------¦
¦ memoizee      ¦ 6,860,227  ¦   1.17%                  ¦ 88          ¦
+---------------+------------+--------------------------+-------------¦
¦ memoizerific  ¦ 3,399,423  ¦   2.60%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ addy-osmani   ¦ 795,071    ¦   1.43%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 715,841    ¦   1.05%                  ¦ 86          ¦
+---------------------------------------------------------------------+


Deep equals ...


+---------------------------------------------------------------------------------------------------------+
¦ Name                                              ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (lodash isEqual)        ¦ 37,582,028 ¦   1.87%                  ¦ 83          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (fast-equals deepEqual) ¦ 21,181,692 ¦   6.75%                  ¦ 66          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ nanomemoize deep equals (fast-equals deepEqual)   ¦ 17,186,548 ¦   3.22%                  ¦ 80          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ nanomemoize deep equals (lodash isEqual)          ¦ 14,995,992 ¦   3.49%                  ¦ 75          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (hash-it isEqual)       ¦ 14,376,860 ¦   3.27%                  ¦ 78          ¦
+---------------------------------------------------------------------------------------------------------+


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
const memoized = micromemoize(sum(a,b) => a + b);
memoized(1,2); // 3
memoized(1,2); // pulled from cache
```

`memoized(function,options) returns function`

The shape of options is:

```javascript
{
  // only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
  maxArgs: number, 
  // number of milliseconds to cache a result
  maxAge: number, 
  // the serializer/key generator to use for single argument functions (multi-argument functionsuse equals)
  serializer: function,
  // the equals function to use for multi-argument functions, e.g. deepEquals for objects (single-argument functions serializer)
  equals: function, 
  // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
  vargs: boolean 
  // number of milliseconds between checks to expire memos, defaults to 1, set to 0 if you want to disable
  expireInterval: number, 
}
```

# Release History (reverse chronological order)

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

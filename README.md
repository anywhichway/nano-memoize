# Faster than fast, smaller than micro ... a nano speed and size memoizer.

# Introduction

The devs [caiogondim](https://github.com/caiogondim) and [planttheidea](https://github.com/planttheidea) have produced consistently fast memoizers. We analyzed their code to see if we could build something faster than [fast-memoize](https://github.com/caiogondim/fast-memoize.js) and smaller than [micro-memoize](https://github.com/planttheidea/micro-memoize) while adding back some of the functionality of [moize](https://github.com/planttheidea/moize) removed in micro-memoize. We think we have done it. The test results below are from running stripped down benchmark code for micro-memoize. The benchmark in this repository does not yet work.

We have found that benchmarks can vary dramartically from O/S to O/S or node version to node version. These tests were run on a Windows 10 64bit 2.4gx machine with 8GB RAM and Node v9.4.0.

Functions with a single parameter...

+----------------------------------------------------------------------+
¦ Name          ¦ Ops / sec   ¦ Relative margin of error ¦ Sample size ¦
+---------------+-------------+--------------------------+-------------¦
¦ nanomemoize   ¦ 171,062,303 ¦ ± 1.14%                  ¦ 87          ¦
+---------------+-------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 76,526,039  ¦ ± 1.09%                  ¦ 84          ¦
+---------------+-------------+--------------------------+-------------¦
¦ moize         ¦ 21,759,163  ¦ ± 0.81%                  ¦ 86          ¦
+---------------+-------------+--------------------------+-------------¦
¦ micro-memoize ¦ 15,174,166  ¦ ± 4.45%                  ¦ 84          ¦
+----------------------------------------------------------------------+

Functions with multiple parameters that contain only primitives...

+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------+------------+--------------------------+-------------¦
¦ nanomemoize   ¦ 20,458,245 ¦ ± 1.51%                  ¦ 88          ¦
+---------------+------------+--------------------------+-------------¦
¦ moize         ¦ 15,245,250 ¦ ± 2.04%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ micro-memoize ¦ 11,533,581 ¦ ± 1.72%                  ¦ 84          ¦
+---------------+------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 800,603    ¦ ± 3.10%                  ¦ 84          ¦
+---------------------------------------------------------------------+

Functions with multiple parameters that contain objects...

+---------------------------------------------------------------------+
¦ Name          ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------+------------+--------------------------+-------------¦
¦ nanomemoize   ¦ 17,706,239 ¦ ± 0.77%                  ¦ 94          ¦
+---------------+------------+--------------------------+-------------¦
¦ moize         ¦ 15,372,543 ¦ ± 0.93%                  ¦ 84          ¦
+---------------+------------+--------------------------+-------------¦
¦ micro-memoize ¦ 12,771,209 ¦ ± 1.12%                  ¦ 85          ¦
+---------------+------------+--------------------------+-------------¦
¦ fast-memoize  ¦ 650,331    ¦ ± 2.63%                  ¦ 90          ¦
+---------------------------------------------------------------------+

Alternative cache types...

+---------------------------------------------------------------------------------------------------------+
¦ Name                                              ¦ Ops / sec  ¦ Relative margin of error ¦ Sample size ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ nanomemoize deep equals (lodash isEqual)          ¦ 22,777,278 ¦ ± 0.75%                  ¦ 82          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ nanomemoize deep equals (fast-equals deepEqual)   ¦ 17,583,950 ¦ ± 2.13%                  ¦ 87          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (hash-it isEqual)       ¦ 15,185,870 ¦ ± 0.75%                  ¦ 82          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (lodash isEqual)        ¦ 14,201,323 ¦ ± 0.63%                  ¦ 90          ¦
+---------------------------------------------------+------------+--------------------------+-------------¦
¦ micro-memoize deep equals (fast-equals deepEqual) ¦ 13,087,155 ¦ ± 0.94%                  ¦ 91          ¦
+---------------------------------------------------------------------------------------------------------+


Along the way we discovered some size and speed optimizations that could be made to [fast-memoize](https://github.com/caiogondim/fast-memoize.js) and when fully tested will make a pull request to [caiogondim](https://github.com/caiogondim) for those of you desiring to stick with fast-memoize. For the single argument case our changes more than doubled the speed of fast-memoize and reduced the size by 30 bytes. The fork is [here](https://github.com/anywhichway/fast-memoize.js). We also discovered that fast-memoize is subject to a key generation risk on edge case functions and fixed the flaw. See this [Medium article](https://codeburst.io/a-key-to-keys-when-javascript-keys-dont-match-ab44c81adc87) for details. 


# Usage


# API

The API is a subset of the `moize` API. Documentation coming.

# Release History (rverse chronological order)

2018-01-24 v0.0.1a - Minor speed enhancements. Benchmark code in repository not yet running.

2018-01-24 v0.0.1a - First public release. Benchmark code in repository not yet running.
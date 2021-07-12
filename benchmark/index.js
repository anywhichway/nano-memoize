/*MIT License
Core benchmark code copied from micro-memoize

Copyright (c) 2018 Tony Quetano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import Benchmark from 'benchmark';
import Table from 'cli-table2';
import ora from 'ora';
import underscore from 'underscore';
import lodash from 'lodash';
import ramda from 'ramda';
import fastMemoize from 'fast-memoize';
import memoizerific from 'memoizerific';
import lru from 'lru-memoize';
import moize from 'moize';
import microMemoize from 'micro-memoize';
import iMemoized from 'iMemoized';
import fastEquals from 'fast-equals';
import hashIt from 'hash-it';
import memoizee from 'memoizee';
import addyOsmani from './addy-osmani.js';
import nanomemoize from '../src/index.js';

const underscoreMemoize = underscore.memoize;
const lodashMemoize = lodash.memoize;
const lruMemoize = lru.default;
const moizeMemoize = moize.default;
const ramdaMemoize = ramda.memoize;

const deepEquals = lodash.isEqual;
const fastDeepEqual = fastEquals.deepEqual;
const hashItEquals = hashIt.isEqual;

const showResults = (benchmarkResults) => {
  const table = new Table({
    head: ['Name', 'Ops / sec', 'Relative margin of error', 'Sample size']
  });

  benchmarkResults.forEach((result) => {
    const name = result.target.name;
    const opsPerSecond = result.target.hz.toLocaleString('en-US', {
      maximumFractionDigits: 0
    });
    const relativeMarginOferror = `± ${result.target.stats.rme.toFixed(2)}%`;
    const sampleSize = result.target.stats.sample.length;

    table.push([name, opsPerSecond, relativeMarginOferror, sampleSize]);
  });

  console.log(table.toString()); // eslint-disable-line no-console
};

const sortDescResults = (benchmarkResults) => {
  return benchmarkResults.sort((a, b) => {
    return a.target.hz < b.target.hz ? 1 : -1;
  });
};

const spinner = ora('Running benchmark');

let results = [];

const onCycle = (event) => {
  results.push(event);
  ora(event.target.name).succeed();
};

const onComplete = () => {
  spinner.stop();

  const orderedBenchmarkResults = sortDescResults(results);

  showResults(orderedBenchmarkResults);
};

const fibonacci = (number) => {
  return number < 2 ? number : fibonacci(number - 1) + fibonacci(number - 2);
};

const fibonacciMultiplePrimitive = (number, isComplete) => {
  if (isComplete) {
    return number;
  }

  const firstValue = number - 1;
  const secondValue = number - 2;

  return (
    fibonacciMultiplePrimitive(firstValue, firstValue < 2) + fibonacciMultiplePrimitive(secondValue, secondValue < 2)
  );
};

const fibonacciMultipleObject = (number, check) => {
  if (check.isComplete) {
    return number;
  }

  const firstValue = number - 1;
  const secondValue = number - 2;

  return (
    fibonacciMultipleObject(firstValue, {
      isComplete: firstValue < 2
    }) +
    fibonacciMultipleObject(secondValue, {
      isComplete: secondValue < 2
    })
  );
};

const fibonacciMultipleDeepEqual = ({number}) => {
  return number < 2
    ? number
    : fibonacciMultipleDeepEqual({number: number - 1}) + fibonacciMultipleDeepEqual({number: number - 2});
};

const runSingleParameterSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Single parameter');
  const fibonacciNumber = 35;

  const mUnderscore = underscoreMemoize(fibonacci);
  const mLodash = lodashMemoize(fibonacci);
 // const mRamda = ramda(fibonacci);
  const mMemoizee = memoizee(fibonacci);
  const mFastMemoize = fastMemoize(fibonacci);
  const mAddyOsmani = addyOsmani(fibonacci);
  const mMemoizerific = memoizerific(Infinity)(fibonacci);
  const mLruMemoize = lruMemoize(Infinity)(fibonacci);
  const mMoize = moizeMemoize(fibonacci);
  const mMicroMemoize = microMemoize(fibonacci);
  const mIMemoized = iMemoized.memoize(fibonacci);
  const mNano = nanomemoize(fibonacci);


  return new Promise((resolve) => {
    fibonacciSuite
	    .add('nano-memoize', () => {
	    	mNano(fibonacciNumber);
	    })
      .add('addy-osmani', () => {
        mAddyOsmani(fibonacciNumber);
      })
      .add('lodash', () => {
        mLodash(fibonacciNumber);
      })
      .add('lru-memoize', () => {
        mLruMemoize(fibonacciNumber);
      })
      .add('memoizee', () => {
        mMemoizee(fibonacciNumber);
      })
      .add('memoizerific', () => {
        mMemoizerific(fibonacciNumber);
      }) 
      /*.add('ramda', () => {
        mRamda(fibonacciNumber);
      })*/
      .add('underscore', () => {
        mUnderscore(fibonacciNumber);
      })
      .add('iMemoized', () => {
      	mIMemoized(fibonacciNumber);
      })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber);
      })
      .add('fast-memoize', () => {
        mFastMemoize(fibonacciNumber);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with a single primitive parameter...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('cycle', onCycle)
      .on('complete', () => {
        onComplete();
        resolve();
      })
      .run({
        async: true
      });
  });
};

const runSingleParameterObjectSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Single parameter');
  const fibonacciNumber = Number(35);

  const mUnderscore = underscoreMemoize(fibonacci);
  const mLodash = lodashMemoize(fibonacci);
 // const mRamda = ramda(fibonacci);
  const mMemoizee = memoizee(fibonacci);
  const mFastMemoize = fastMemoize(fibonacci);
  const mAddyOsmani = addyOsmani(fibonacci);
  const mMemoizerific = memoizerific(Infinity)(fibonacci);
  const mLruMemoize = lruMemoize(Infinity)(fibonacci);
  const mMoize = moizeMemoize(fibonacci);
  const mMicroMemoize = microMemoize(fibonacci);
  const mIMemoized = iMemoized.memoize(fibonacci);
  const mNano = nanomemoize(fibonacci,{relaxed:true});


  return new Promise((resolve) => {
    fibonacciSuite
	    .add('nano-memoize', () => {
	    	mNano(fibonacciNumber);
	    })
      .add('addy-osmani', () => {
        mAddyOsmani(fibonacciNumber);
      })
      .add('lodash', () => {
        mLodash(fibonacciNumber);
      })
      .add('lru-memoize', () => {
        mLruMemoize(fibonacciNumber);
      })
      .add('memoizee', () => {
        mMemoizee(fibonacciNumber);
      })
      .add('memoizerific', () => {
        mMemoizerific(fibonacciNumber);
      }) 
      /*.add('ramda', () => {
        mRamda(fibonacciNumber);
      })*/
      .add('underscore', () => {
        mUnderscore(fibonacciNumber);
      })
      .add('iMemoized', () => {
      	mIMemoized(fibonacciNumber);
      })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber);
      })
      .add('fast-memoize', () => {
        mFastMemoize(fibonacciNumber);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with a single object parameter...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('cycle', onCycle)
      .on('complete', () => {
        onComplete();
        resolve();
      })
      .run({
        async: true
      });
  });
};

const runMultiplePrimitiveSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Multiple parameters (Primitive)');
  const fibonacciNumber = 35;
  const isComplete = false;

  const mMemoizee = memoizee(fibonacciMultiplePrimitive);
  const mFastMemoize = fastMemoize(fibonacciMultiplePrimitive);
  const mAddyOsmani = addyOsmani(fibonacciMultiplePrimitive);
  const mMemoizerific = memoizerific(Infinity)(fibonacciMultiplePrimitive);
  const mLruMemoize = lruMemoize(Infinity)(fibonacciMultiplePrimitive);
  const mMoize = moizeMemoize(fibonacciMultiplePrimitive);
  const mMicroMemoize = microMemoize(fibonacciMultiplePrimitive);
  const mIMemoized = iMemoized.memoize(fibonacciMultiplePrimitive);
  const mNano = nanomemoize(fibonacciMultiplePrimitive);

  return new Promise((resolve) => {
    fibonacciSuite
	    .add('nano-memoize', () => {
	    	mNano(fibonacciNumber, isComplete);
	    })
      .add('addy-osmani', () => {
        mAddyOsmani(fibonacciNumber, isComplete);
      })
      .add('lru-memoize', () => {
        mLruMemoize(fibonacciNumber, isComplete);
      })
      .add('memoizee', () => {
        mMemoizee(fibonacciNumber, isComplete);
      })
      .add('iMemoized', () => {
      	mIMemoized(fibonacciNumber, isComplete);
      })
      .add('memoizerific', () => {
        mMemoizerific(fibonacciNumber, isComplete);
      })
	    .add('fast-memoize', () => {
	      mFastMemoize(fibonacciNumber, isComplete);
	    })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber, isComplete);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber, isComplete);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with multiple parameters that contain only primitives...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('cycle', onCycle)
      .on('complete', () => {
        onComplete();
        resolve();
      })
      .run({
        async: true
      });
  });
};

const runMultipleObjectSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Multiple parameters (Object)');
  const fibonacciNumber = 35;
  const isComplete = {
    isComplete: false
  };

  const mMemoizee = memoizee(fibonacciMultipleObject);
  const mFastMemoize = fastMemoize(fibonacciMultipleObject);
  const mAddyOsmani = addyOsmani(fibonacciMultipleObject);
  const mMemoizerific = memoizerific(Infinity)(fibonacciMultipleObject);
  const mLruMemoize = lruMemoize(Infinity)(fibonacciMultipleObject);
  const mMoize = moizeMemoize(fibonacciMultipleObject);
  const mMicroMemoize = microMemoize(fibonacciMultipleObject);
  const mNano = nanomemoize(fibonacciMultipleObject);
  
  return new Promise((resolve) => {
    fibonacciSuite
	    .add('nano-memoize', () => {
	    	mNano(fibonacciNumber,isComplete);
	    })
      .add('addy-osmani', () => {
        mAddyOsmani(fibonacciNumber, isComplete);
      })
      .add('lru-memoize', () => {
        mLruMemoize(fibonacciNumber, isComplete);
      })
      .add('memoizee', () => {
        mMemoizee(fibonacciNumber, isComplete);
      })
      .add('memoizerific', () => {
        mMemoizerific(fibonacciNumber, isComplete);
      })
	    .add('fast-memoize', () => {
	      mFastMemoize(fibonacciNumber, isComplete);
	    })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber, isComplete);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber, isComplete);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with multiple parameters that contain objects...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('cycle', onCycle)
      .on('complete', () => {
        onComplete();
        resolve();
      })
      .run({
        async: true
      });
  });
};

const runAlternativeOptionsSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Multiple parameters (Object)');
  const fibonacciNumber = {
    number: 35
  };

  const mMicroMemoizeDeep = microMemoize(fibonacciMultipleDeepEqual, {
    isEqual: deepEquals
  });

  const mMicroMemoizeFastDeep = microMemoize(fibonacciMultipleDeepEqual, {
    isEqual: fastDeepEqual
  });

  const mMicroMemoizeHashIt = microMemoize(fibonacciMultipleDeepEqual, {
    isEqual: hashItEquals
  });
  
  const mNanoDeep = nanomemoize(fibonacciMultipleDeepEqual, {
    equals: deepEquals
  });
  const mNanoFastDeep = nanomemoize(fibonacciMultipleDeepEqual, {
    equals: fastDeepEqual
  });
  const mNanoHashIt = nanomemoize(fibonacciMultipleDeepEqual, {
    equals: hashItEquals
  });

  return new Promise((resolve) => {
    fibonacciSuite
	    .add('nanomemoize deep equals (lodash isEqual)', () => {
	    	mNanoDeep(fibonacciNumber);
	    })
	    .add('nanomemoize deep equals (fast-equals deepEqual)', () => {
	      mNanoFastDeep(fibonacciNumber);
	    })
	    .add('nanomemoize deep equals (hash-it isEqual)', () => {
	      mNanoHashIt(fibonacciNumber);
	    })
      .add('micro-memoize deep equals (lodash isEqual)', () => {
        mMicroMemoizeDeep(fibonacciNumber);
      })
      .add('micro-memoize deep equals (fast-equals deepEqual)', () => {
        mMicroMemoizeFastDeep(fibonacciNumber);
      })
      .add('micro-memoize deep equals (hash-it isEqual)', () => {
        mMicroMemoizeHashIt(fibonacciNumber);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for alternative cache types...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('cycle', onCycle)
      .on('complete', () => {
        onComplete();
        resolve();
      })
      .run({
        async: true
      });
  });
};

// runAlternativeOptionsSuite();

//runMultiplePrimitiveSuite();

runSingleParameterSuite()
  .then(runSingleParameterObjectSuite)
  .then(runMultiplePrimitiveSuite)
  .then(runMultipleObjectSuite)
  .then(runAlternativeOptionsSuite);

'use strict';

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

const vm = require("node:vm");
const v8 = require("v8");

v8.setFlagsFromString('--expose_gc');
const gc = vm.runInNewContext('gc');

const Benchmark = require('benchmark');
const Table = require('cli-table');
const ora = require('ora');

const underscore = require('underscore').memoize;
const lodash = require('lodash').memoize;
const ramda = require('ramda').memoize;
const memoizee = require('memoizee');
const fastMemoize = require('fast-memoize');
const addyOsmani = require('./addy-osmani');
const memoizerific = require('memoizerific');
const lruMemoize = require('lru-memoize').default;
const microMemoize = require('micro-memoize'); 
const iMemoized = require('iMemoized');
const nanomemoize = require('../dist/nano-memoize.js').default;
const moize = require('moize');
const memize = require('memize');


const deepEquals = require('lodash').isEqual;
const fastEquals = require('fast-equals').deepEqual;
const fastDeepEqual = require('fast-deep-equal/ES6');

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
  gc();
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

const fibonacciSingleArray = (array) => {
  return array[0] < 2
      ? array[0]
      : fibonacciSingleArray([array[0] - 1]) +
      fibonacciSingleArray([array[0] - 2]);
};

const fibonacciMultipleArray = (array, check) => {
  if (check[0]) {
    return array[0];
  }

  const firstValue = array[0] - 1;
  const secondValue = array[0] - 2;

  return (
      fibonacciMultipleArray([firstValue], [firstValue < 2]) +
      fibonacciMultipleArray([secondValue], [secondValue < 2])
  );
};

const fibonacciMultipleMixed = (number, check) => {
  if (check.isComplete) {
    return number;
  }

  const firstValue = number - 1;
  const secondValue = number - 2;

  return (
    fibonacciMultipleMixed(firstValue, {
      isComplete: firstValue < 2
    }) +
    fibonacciMultipleMixed(secondValue, {
      isComplete: secondValue < 2
    })
  );
};

const fibonacciSingleObject = ({number}) => {
  return number < 2
    ? number
    : fibonacciSingleObject({number: number - 1}) + fibonacciSingleObject({number: number - 2});
};

const fibonacciMultipleObject = ({number}, check) => {
  if (check.isComplete) {
    return number;
  }

  const firstValue = number - 1;
  const secondValue = number - 2;

  return (
      fibonacciMultipleObject({number:firstValue}, {
        isComplete: firstValue < 2
      }) +
      fibonacciMultipleObject({number:secondValue}, {
        isComplete: secondValue < 2
      })
  );
};

const runSingleParameterSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Single primitive parameter');
  const fibonacciNumber = 35;

  const mUnderscore = underscore(fibonacci);
  const mLodash = lodash(fibonacci);
 // const mRamda = ramda(fibonacci);
  const mMemoizee = memoizee(fibonacci);
  const mFastMemoize = fastMemoize(fibonacci);
  const mAddyOsmani = addyOsmani(fibonacci);
  const mMemoizerific = memoizerific(Infinity)(fibonacci);
  const mLruMemoize = lruMemoize(Infinity)(fibonacci);
  const mMoize = moize(fibonacci);
  const mMicroMemoize = microMemoize(fibonacci);
  const mIMemoized = iMemoized.memoize(fibonacci);
  const mNano = nanomemoize(fibonacci);
  const mMemize = memize(fibonacci);


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
        .add('memize', () => {
        mMemize(fibonacciNumber);
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
  const fibonacciSuite = new Benchmark.Suite('Single object parameter');
  const fibonacciNumber = {number:35};

  const mUnderscore = underscore(fibonacciSingleObject);
  const mLodash = lodash(fibonacciSingleObject);
 // const mRamda = ramda(fibonacciSingleObject);
  const mMemoizee = memoizee(fibonacciSingleObject);
  const mFastMemoize = fastMemoize(fibonacciSingleObject);
  const mAddyOsmani = addyOsmani(fibonacciSingleObject);
  const mMemoizerific = memoizerific(Infinity)(fibonacciSingleObject);
  const mLruMemoize = lruMemoize(Infinity)(fibonacciSingleObject);
  const mMoize = moize(fibonacciSingleObject);
  const mMicroMemoize = microMemoize(fibonacciSingleObject);
  const mIMemoized = iMemoized.memoize(fibonacciSingleObject);
  const mNano = nanomemoize(fibonacciSingleObject);
  const mMemize = memize(fibonacciSingleObject);


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
      .add('memize', () => {
        mMemize(fibonacciNumber);
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
  const mMoize = moize(fibonacciMultiplePrimitive);
  const mMicroMemoize = microMemoize(fibonacciMultiplePrimitive);
  const mIMemoized = iMemoized.memoize(fibonacciMultiplePrimitive);
  const mNano = nanomemoize(fibonacciMultiplePrimitive);
  const mMemize = memize(fibonacciMultiplePrimitive);

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
        .add('memize', () => {
          mMemize(fibonacciNumber, isComplete);
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
  const fibonacciSuite = new Benchmark.Suite('Multiple object parameter');
  const fibonacciNumber = {number:35};
  const check = {};

  const mUnderscore = underscore(fibonacciMultipleObject);
  // const mRamda = ramda(fibonacciMultipleObject);
  const mMemoizee = memoizee(fibonacciMultipleObject);
  const mFastMemoize = fastMemoize(fibonacciMultipleObject);
  const mAddyOsmani = addyOsmani(fibonacciMultipleObject);
  const mMemoizerific = memoizerific(Infinity)(fibonacciMultipleObject);
  const mLruMemoize = lruMemoize(Infinity)(fibonacciMultipleObject);
  const mMoize = moize(fibonacciMultipleObject);
  const mMicroMemoize = microMemoize(fibonacciMultipleObject);
  const mIMemoized = iMemoized.memoize(fibonacciMultipleObject);
  const mNano = nanomemoize(fibonacciMultipleObject);
  const mMemize = memize(fibonacciMultipleObject);


  return new Promise((resolve) => {
    fibonacciSuite
        .add('nano-memoize', () => {
          mNano(fibonacciNumber,check);
        })
        .add('addy-osmani', () => {
          mAddyOsmani(fibonacciNumber,check);
        })
        .add('lru-memoize', () => {
          mLruMemoize(fibonacciNumber,check);
        })
        .add('memoizee', () => {
          mMemoizee(fibonacciNumber,check);
        })
        .add('memoizerific', () => {
          mMemoizerific(fibonacciNumber,check);
        })
        /*.add('ramda', () => {
          mRamda(fibonacciNumber);
        })*/
        .add('underscore', () => {
          mUnderscore(fibonacciNumber,check);
        })
        .add('iMemoized', () => {
          mIMemoized(fibonacciNumber,check);
        })
        .add('micro-memoize', () => {
          mMicroMemoize(fibonacciNumber,check);
        })
        .add('moize', () => {
          mMoize(fibonacciNumber,check);
        })
        .add('fast-memoize', () => {
          mFastMemoize(fibonacciNumber,check);
        })
        .add('memize', () => {
          mMemize(fibonacciNumber, check);
        })
        .on('start', () => {
          console.log(''); // eslint-disable-line no-console
          console.log('Starting cycles for functions with multiple object parameters...'); // eslint-disable-line no-console

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

const runMultipleMixedSuite = () => {
  const fibonacciSuite = new Benchmark.Suite('Multiple mixed parameters');
  const fibonacciNumber = 35;
  const isComplete = {
    isComplete: false
  };

  const mMemoizee = memoizee(fibonacciMultipleMixed);
  const mFastMemoize = fastMemoize(fibonacciMultipleMixed);
  const mAddyOsmani = addyOsmani(fibonacciMultipleMixed);
  const mMemoizerific = memoizerific(Infinity)(fibonacciMultipleMixed);
  const mLruMemoize = lruMemoize(Infinity)(fibonacciMultipleMixed);
  const mMoize = moize(fibonacciMultipleMixed);
  const mMicroMemoize = microMemoize(fibonacciMultipleMixed);
  const mNano = nanomemoize(fibonacciMultipleMixed);
  const mMemize = memize(fibonacciMultipleMixed);
  
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
        .add('memize', () => {
          mMemize(fibonacciNumber, isComplete);
        })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with multiple mixed parameters ...'); // eslint-disable-line no-console

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
  const fibonacciSuite = new Benchmark.Suite('Alternative single object');
  const fibonacciNumber = {
    number: 35
  };

  const mMicroMemoizeDeepEquals = microMemoize(fibonacciSingleObject, {
    isEqual: deepEquals
  });

  const mMicroMemoizeFastEquals = microMemoize(fibonacciSingleObject, {
    isEqual: fastEquals
  });

  const mMicroMemoizeFastDeepEquals = microMemoize(fibonacciSingleObject, {
    isEqual: fastDeepEqual
  });


  const mMoizeDeep = moize(fibonacciSingleObject, {
    isDeepEqual: true
  });

  const mMoizeDeepEquals = moize(fibonacciSingleObject, {
    matchesArg: deepEquals
  });

  const mMoizeFastEquals = moize(fibonacciSingleObject, {
    matchesArg: fastEquals
  });

  const mMoizeFastDeepEquals = moize(fibonacciSingleObject, {
    matchesArg: fastDeepEqual
  });

  
  const mNanoDeepEquals = nanomemoize(fibonacciSingleObject, {
    equals: deepEquals
  });
  const mNanoFastEquals = nanomemoize(fibonacciSingleObject, {
    equals: fastEquals
  });
  const mNanoFastDeepEquals = nanomemoize(fibonacciSingleObject, {
    equals: fastDeepEqual
  });


  return new Promise((resolve) => {
    fibonacciSuite
        .add('nanomemoize deep equals (lodash isEqual)', () => {
          mNanoDeepEquals(fibonacciNumber);
        })
        .add('nanomemoize fast equals (fast-equals deep)', () => {
          mNanoFastEquals(fibonacciNumber);
        })
        .add('nanomemoize fast equals (fast-deep-equals)', () => {
          mNanoFastDeepEquals(fibonacciNumber);
        })
        .add('micro-memoize deep equals (lodash isEqual)', () => {
          mMicroMemoizeDeepEquals(fibonacciNumber);
        })
        .add('micro-memoize deep equals (fast-equals)', () => {
          mMicroMemoizeFastEquals(fibonacciNumber);
        })
        .add('micro-memoize deep equals (fast-deep-equal)', () => {
          mMicroMemoizeFastDeepEquals(fibonacciNumber);
        })
        .add('moize deep (internal)', () => {
          mMoizeDeep(fibonacciNumber);
        })
        .add('moize deep equals (lodash isEqual)', () => {
          mMoizeDeepEquals(fibonacciNumber);
        })
        .add('moize deep equals (fast-equals)', () => {
          mMoizeFastEquals(fibonacciNumber);
        })
        .add('moize deep equals (fast-deep-equal)', () => {
          mMoizeFastEquals(fibonacciNumber);
        })

      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for alternative cache types...'); // eslint-disable-line no-console

        results = [];

        spinner.start();
      })
      .on('abort',(...args) => {
          console.log('abort',args);
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
  .then(runMultipleMixedSuite)
  .then(runAlternativeOptionsSuite);

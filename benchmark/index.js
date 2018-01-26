'use strict';

const Benchmark = require('benchmark');
const Table = require('cli-table2');
const ora = require('ora');

const underscore = require('underscore').memoize;
const lodash = require('lodash').memoize;
const ramda = require('ramda').memoize;
const memoizee = require('memoizee');
const fastMemoize = require('fast-memoize');
const addyOsmani = require('./addy-osmani');
const memoizerific = require('memoizerific');
const lruMemoize = require('lru-memoize').default;
const moize = require('moize');
const microMemoize = require('../dist/micro-memoize.js').default; //require('../lib').default;
const iMemoized = require('iMemoized');



/*function micromemo (fn, options={}) {
	const {equals,maxAge,maxArgs,serializer} = options,
		memoized = resolver.bind(this,fn,{},serializer,equals,maxAge);
  return memoized;
}
function resolver (fn,singles,serializer=JSON.stringify,equals,maxAge,arg) {
	if(!equals && arguments.length<=6) {
	  const cacheKey = typeof arg === 'string' || typeof arg === 'function' || typeof arg === 'object' ? serializer(arg) : arg;
	  return singles[cacheKey] || (singles[cacheKey]=fn.call(this, arg));
	}
	const args = [].slice.call(arguments,5),
		result = {};
	equals || (equals = (a,b) => a===b);
	for(let i=0;i<keys.length;i++) {
		if(keys[i]===null) { result.index = i; continue; }
		const key = maxArgs ? keys[i].slice(0,maxArgs) : keys[i];
		if(key.length===args.length) {
			const max = key.length - 1;
			for(let j=0;j<=max;j++) {
				if(!equals(key[j],args[j])) break;
				if(j===max) {
					result.index = i;
					result.value = values[i];
				}
			}
		}
	}
	const i = result.index>=0 ? result.index : values.length;
	if(maxAge) {
		if(timeouts[i]) clearTimeout(timeouts[i]);
		timeouts[i] = setTimeout(() => keys[i]=values[i]=timeouts[i]=null,maxAge)
	}
	return typeof(result.value)==="undefined" ? values[i] = fn.call(this,...(keys[i] = args)) : result.value;
};*/

function micromemo (fn, options={}) {
	const {serializer=JSON.stringify,equals,maxAge,maxArgs,maxSize,stats} = options,
		singles = {},
		keys = [],
		values = [],
		changes = [],
		change = (cache,key,property) => {
			if(property) key = typeof(key) + "@" + key;
			changes[key] = {key,cache};
		},
		hits = [],
		hit = (key,cache,property) => {
			if(property) key = typeof(key) + "@" + key;
			let record = hits[key];
			if(!record) record = hits[key] = {count:0,cache};
			hit.count++;
			hit.time = Date.now();
		},
		timeouts =  [],
		timeout = (key,cache,property) => {
			if(property) key = typeof(key) + "@" + key;
			if(timeouts[key]) clearTimeout(timeouts[key]);
			timeouts[key] = setTimeout(() => cache[key]=timeouts[key]=null,maxAge);
		};
	let memoized;
	if(fn.length===1 && !equals) {
		memoized = single.bind(
			 this,
			 fn,
			 singles,
			 (maxSize || maxAge || stats ? change.bind(this,values): null),
			 serializer
			 );
	} else {
		memoized = multiple.bind(
				 this,
				 fn,
				 keys,
				 values,
				 serializer,
				 equals ? equals : (a,b) => a===b,
				 (maxSize || maxAge || stats ? change.bind(this,values): null),
				 maxArgs
				 );
	}
	memoized.clear = () => {
		Object.keys(singles).forEach(key => delete singles[key]);
		keys.splice(0,keys.length);
		values.splice(0,values.length);
		changes.splice(0,changes.length);
		Object.keys(changes).forEach(key => key==="length" || delete changes[key]);
		timeouts.forEach(timeout => !timeout || clearTimeout(timeout));
		timeouts.splice(0,timeouts.length);
		Object.keys(timeouts).forEach(key => key==="length" || delete timeouts[key]);
	}
	return memoized;
}

function single (f,cache,change,serializer,arg) {
	if(arguments.length<=5) {
		const key = (!arg || typeof arg === "number" || typeof arg ==="boolean" ? arg : serializer(arg));
		if(change) change(key,true);
		return cache[key] || ( cache[key] = f.call(this, arg));
	}
}
	function multiple(f,keys,values,serializer,equals,change,maxArgs,...args) {
		const result = {};
		for(let i=0;i<keys.length;i++) {
			let key = keys[i];
			if(key===null) { result.index = i; continue; }
			if(maxArgs) key = key.slice(0,maxArgs);
			if(key.length===args.length) {
				const max = key.length - 1;
				for(let j=0;j<=max;j++) {
					if(!equals(key[j],args[j])) break;
					if(j===max) {
						result.index = i;
						result.value = values[i];
					}
				}
			}
		}
		const i = result.index>=0 ? result.index : values.length;
		if(change) change(key,true);
		return typeof result.value === "undefined" ? result.value = values[i] = f(...(keys[i] = args)) : result.value;
	}




const deepEquals = require('lodash').isEqual;
const fastDeepEqual = require('fast-equals').deepEqual;
const hashItEquals = require('hash-it').isEqual;

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

  const mUnderscore = underscore(fibonacci);
  const mLodash = lodash(fibonacci);
  const mRamda = ramda(fibonacci);
  const mMemoizee = memoizee(fibonacci);
  const mFastMemoize = fastMemoize(fibonacci);
  const mAddyOsmani = addyOsmani(fibonacci);
  const mMemoizerific = memoizerific(Infinity)(fibonacci);
  const mLruMemoize = lruMemoize(Infinity)(fibonacci);
  const mMoize = moize(fibonacci);
  const mMicroMemoize = microMemoize(fibonacci);
  const mIMemoized = iMemoized.memoize(fibonacci);
  const mMicro = micromemo(fibonacci);


  return new Promise((resolve) => {
    fibonacciSuite
     /* .add('addy-osmani', () => {
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
      }) .add('ramda', () => {
        mRamda(fibonacciNumber);
      })
      .add('underscore', () => {
        mUnderscore(fibonacciNumber);
      })
      .add('iMemoized', () => {
      	mIMemoized(fibonacciNumber);
      })*/
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber);
      })
      .add('fast-memoize', () => {
        mFastMemoize(fibonacciNumber);
      })
      .add('micromemo', () => {
      	mMicro(fibonacciNumber);
      })
      .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting cycles for functions with a single parameter...'); // eslint-disable-line no-console

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
  const mMicro = micromemo(fibonacciMultiplePrimitive);

  return new Promise((resolve) => {
    fibonacciSuite
      /*.add('addy-osmani', () => {
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
      })*/
    .add('fast-memoize', () => {
      mFastMemoize(fibonacciNumber, isComplete);
    })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber, isComplete);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber, isComplete);
      })
      .add('micromemo', () => {
      	mMicro(fibonacciNumber, isComplete);
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
  const mMoize = moize(fibonacciMultipleObject);
  const mMicroMemoize = microMemoize(fibonacciMultipleObject);
  const mMicro = micromemo(fibonacciMultipleObject);

  return new Promise((resolve) => {
    fibonacciSuite
     /* .add('addy-osmani', () => {
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
      })*/
    .add('fast-memoize', () => {
      mFastMemoize(fibonacciNumber, isComplete);
    })
      .add('micro-memoize', () => {
        mMicroMemoize(fibonacciNumber, isComplete);
      })
      .add('moize', () => {
        mMoize(fibonacciNumber, isComplete);
      })
      .add('micromemo', () => {
      	mMicro(fibonacciNumber,isComplete);
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
  
  const mMicroDeep = micromemo(fibonacciMultipleDeepEqual, {
    equals: deepEquals
  });
  const mMicroFastDeep = micromemo(fibonacciMultipleDeepEqual, {
    equals: fastDeepEqual
  });

  return new Promise((resolve) => {
    fibonacciSuite
      .add('micro-memoize deep equals (lodash isEqual)', () => {
        mMicroMemoizeDeep(fibonacciNumber);
      })
      .add('micro-memoize deep equals (fast-equals deepEqual)', () => {
        mMicroMemoizeFastDeep(fibonacciNumber);
      })
      .add('micro-memoize deep equals (hash-it isEqual)', () => {
        mMicroMemoizeHashIt(fibonacciNumber);
      })
      .add('micromemo deep equals (lodash isEqual)', () => {
      	mMicroDeep(fibonacciNumber);
      })
      .add('micromemo deep equals (fast-equals deepEqual)', () => {
        mMicroFastDeep(fibonacciNumber);
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

runSingleParameterSuite()
  .then(runMultiplePrimitiveSuite)
  .then(runMultipleObjectSuite)
  .then(runAlternativeOptionsSuite);

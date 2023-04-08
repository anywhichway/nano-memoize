
const vm = require("node:vm");
const v8 = require("v8");

v8.setFlagsFromString('--expose_gc');
const gc = vm.runInNewContext('gc');

const Benchmark = require('benchmark');
const assert = require('assert');
const Table = require('cli-table2');
const ora = require('ora');

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

const nanomemoize = require('../dist/nano-memoize.js').default;
const fastMemoize = require('fast-memoize');
const microMemoize = require('micro-memoize');
const moize = require('moize');

const fibonacciMultipleMixed = (number, check={}) => {
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
}

const manyArgsToString = (...args) => {
    return JSON.stringify(args);
}

const sumManyArgs = (...args) => {
    return args.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
}


// Memoize each expensive function
const nanomemoizedFunction1 = nanomemoize(fibonacciMultipleMixed);
const fastMemoizedFunction1 = fastMemoize(fibonacciMultipleMixed);
const microMemoizedFunction1 = microMemoize(fibonacciMultipleMixed);
const moizeMemoizedFunction1 = microMemoize(fibonacciMultipleMixed);
const nanomemoizedFunction2 = nanomemoize(manyArgsToString);
const fastMemoizedFunction2 = fastMemoize(manyArgsToString);
const microMemoizedFunction2 = microMemoize(manyArgsToString);
const moizeMemoizedFunction2 = microMemoize(manyArgsToString);
const nanomemoizedFunction3 = nanomemoize(sumManyArgs);
const fastMemoizedFunction3 = fastMemoize(sumManyArgs);
const microMemoizedFunction3 = microMemoize(sumManyArgs);
const moizeMemoizedFunction3 = microMemoize(sumManyArgs);



// Set up the benchmark test
const suite = new Benchmark.Suite();

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
// Add the tests for each memoized function
suite
    .add('nanomemoizedFunctions', () => {
        const random = Math.round(Math.random()*10);
        let args1, args2
        if(random<=2) {
            args1 = [5,{}];
            args2 = [1,2,3,4,5,6,7,8,9,10];
        } else {
            args1 = [random,{}];
            args2 = [].fill(random,0,10);
        }
        nanomemoizedFunction1.apply(null,args1);
        const result = nanomemoizedFunction2.apply(null,args2);
        nanomemoizedFunction3.apply(null,args2);
        const shouldBe = manyArgsToString.apply(null,args2);
        if(result!==shouldBe) console.log("err nanomemoizedFunction2")
        //assert.strictEqual(result,shouldBe);
    })
    .add('fastMemoizedFunctions', () => {
        const random = Math.round(Math.random()*10);
        let args1, args2;
        if(random<=2) {
            args1 = [5,{}];
            args2 = [1,2,3,4,5,6,7,8,9,10];
        } else {
            args1 = [random,{}];
            args2 = [].fill(random,0,10);
        }
        const result = fastMemoizedFunction1.apply(null,args1);
        fastMemoizedFunction2.apply(null,args2);
        fastMemoizedFunction3.apply(null,args2);
        //const shouldBe = fibonacciMultipleMixed.apply(null,args);
        //if(result!==shouldBe) console.log("err nanomemoizedFunction")
        //assert.strictEqual(result,shouldBe);
    })
    .add('microMemoizedFunctions', () => {
        const random = Math.round(Math.random()*10);
        let args1, args2;
        if(random<=2) {
            args1 = [5,{}];
            args2 = [1,2,3,4,5,6,7,8,9,10];
        } else {
            args1 = [random,{}];
            args2 = [].fill(random,0,10);
        }
        const result = microMemoizedFunction1.apply(null,args1);
        microMemoizedFunction2.apply(null,args2);
        microMemoizedFunction3.apply(null,args2);
        //const shouldBe = fibonacciMultipleMixed.apply(null,args);
        //if(result!==shouldBe) console.log("err nanomemoizedFunction")
        //assert.strictEqual(result,shouldBe);
    })
    .add('moizeMemoizedFunctions', () => {
        const random = Math.round(Math.random()*10);
        let args1, args2;
        if(random<=2) {
            args1 = [5,{}];
            args2 = [1,2,3,4,5,6,7,8,9,10];
        } else {
            args1 = [random,{}];
            args2 = [].fill(random,0,10);
        }
        const result = moizeMemoizedFunction1.apply(null,args1);
        moizeMemoizedFunction2.apply(null,args2);
        moizeMemoizedFunction3.apply(null,args2);
        //const shouldBe = fibonacciMultipleMixed.apply(null,args);
        //if(result!==shouldBe) console.log("err nanomemoizedFunction")
        //assert.strictEqual(result,shouldBe);
    })
    .on('start', () => {
        console.log(''); // eslint-disable-line no-console
        console.log('Starting real world simulation...'); // eslint-disable-line no-console
        results = [];
        spinner.start();
    })
    .on('cycle', onCycle)
    .on('complete', () => {
        onComplete();
        //resolve();
    })
    .run({
        async: true
    });

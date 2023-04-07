
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


// Memoize each expensive function
const nanomemoizedFunction = nanomemoize(fibonacciMultipleMixed);
const fastMemoizedFunction = fastMemoize(fibonacciMultipleMixed);
const microMemoizedFunction = microMemoize(fibonacciMultipleMixed);
const moizeMemoizedFunction = microMemoize(fibonacciMultipleMixed)


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
    .add('nanomemoizedFunction', () => {
        const random = Math.round(Math.random()*10);
        let args;
        if(random<=2) {
            args = [5,{}];
        } else {
            args = [random,{}];
        }
        const result = nanomemoizedFunction.apply(null,args);
        const shouldBe = fibonacciMultipleMixed.apply(null,args);
        if(result!==shouldBe) console.log("err nanomemoizedFunction")
        assert.strictEqual(result,shouldBe);
    })
    .add('fastmoizedFunction', () => {
        const random = Math.round(Math.random()*10);
        let args;
        if(random<=2) {
            args = [5,{}];
        } else {
            args = [random,{}];
        }
        const result = fastMemoizedFunction.apply(null,args);
        const shouldBe = fibonacciMultipleMixed.apply(null,args);
        if(result!==shouldBe) console.log("err nanomemoizedFunction")
        assert.strictEqual(result,shouldBe);
    })
    .add('microMemoizedFunction', () => {
        const random = Math.round(Math.random()*10);
        let args;
        if(random<=2) {
            args = [5,{}];
        } else {
            args = [random,{}];
        }
        const result = microMemoizedFunction.apply(null,args);
        const shouldBe = fibonacciMultipleMixed.apply(null,args);
        if(result!==shouldBe) console.log("err nanomemoizedFunction")
        assert.strictEqual(result,shouldBe);
    })
    .add('moizeMemoizedFunction', () => {
        const random = Math.round(Math.random()*10);
        let args;
        if(random<=2) {
            args = [5,{}];
        } else {
            args = [random,{}];
        }
        const result = moizeMemoizedFunction.apply(null,args);
        const shouldBe = fibonacciMultipleMixed.apply(null,args);
        if(result!==shouldBe) console.log("err nanomemoizedFunction")
        assert.strictEqual(result,shouldBe);
    })
    /*.add('memoizedFunction2', () => {
        const arg1 = Math.random();
        const arg2 = Math.random();
        const result = memoizedFunction2(arg1, arg2);
        assert.strictEqual(result, expensiveFunction2(arg1, arg2));
    })
    .add('memoizedFunction3', () => {
        const arg1 = Math.random();
        const arg2 = 'test';
        const arg3 = { key: 'value' };
        const result = memoizedFunction3(arg1, arg2, arg3);
        assert.strictEqual(result, expensiveFunction3(arg1, arg2, arg3));
    })
    .add('memoizedFunction4', () => {
        const arg1 = 'a';
        const arg2 = Math.random();
        const arg3 = true;
        const arg4 = { key: 'value' };
        const result = memoizedFunction4(arg1, arg2, arg3, arg4);
        assert.deepStrictEqual(result, expensiveFunction4(arg1, arg2, arg3, arg4));
    })
    .add('memoizedFunction5', () => {
        const arg1 = Math.random();
        const arg2 = 'test';
        const arg3 = { key: 'value' };
        const arg4 = [1, 2, 3];
        const arg5 = false;
        const result = memoizedFunction5(arg1, arg2, arg3, arg4, arg5);
        assert.deepStrictEqual(result, expensiveFunction5(arg1, arg2, arg3, arg4, arg5));
    }) */
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

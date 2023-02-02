var chai,
	expect,
	nanomemoize,
	lodash;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	lodash = require("lodash");
	nanomemoize = require("../dist/nano-memoize.js").default;
}

const deepEquals = require('lodash').isEqual;

const fastDeepEqual = require('fast-deep-equal/es6');

function singleArg(arg) {
	return arg;
}

function multipleArg(arg1,arg2) {
	return {arg1:arg1,arg2:arg2};
}

singleArg = nanomemoize(singleArg);

multiplArg = nanomemoize(multipleArg);

varArg = nanomemoize(function() { return [].slice.call(arguments); });

describe("Test",function() {
	it("memoize functions with function arg", function() {
		const memoized = nanomemoize(function (fn) {
			  return function (o) {
				    return fn(o);
				  };
				}),
			myFunc = memoized(function(o) { return o; }),
			result = myFunc(0);
		expect(typeof(memoized)).equal("function");
		expect(typeof(myFunc)).equal("function");
		expect(result).equal(0);
	});

	it("single primitive number arg cached",function() {
		const value = 1,
			result = singleArg(value),
			keys = singleArg.keys(),
			values = singleArg.values();
		expect(result).to.equal(value);
		expect(keys[0]).to.equal(value);
		expect(values[0]).to.equal(result);
	});
	it("clear cache",function() {
		const value = 1;
		singleArg.clear();
		expect(singleArg.values()[0]).to.equal(undefined);
		expect(singleArg(value)).to.equal(value);
		expect(singleArg.values()[0]).to.equal(value);
	});
	it("single primitive string arg cached",function() {
		singleArg.clear();
		const value = "1",
			result = singleArg(value),
			keys = singleArg.keys(),
			values = singleArg.values();
		expect(keys[0]).to.equal(value);
		expect(values[0]).to.equal(value);
	});
	it("single object arg cached",function() {
		const value = {p1:1},
			result = singleArg(value);
		expect(result).to.equal(value);
	});
	it("single null arg cached", function() {
		const value = null,
			result = singleArg(value);
		expect(result).to.equal(value);
		expect(singleArg(value)).to.equal(value);
	});
	it("single undefined arg cached", function () {
		const res1 = singleArg();
		const res2 = singleArg(undefined);
		expect(res1).to.equal(res2);
	});
	it("multiple arg primitive cached",function() {
		const result = multipleArg(1,2);
		expect(result.arg1).to.equal(1);
		expect(result.arg2).to.equal(2);
	});
	it("multiple arg object cached",function() {
		const arg1 = {arg:1},
			arg2 = {arg:2},
		result = multipleArg(arg1,arg2);
		expect(result.arg1.arg).to.equal(1);
		expect(result.arg2.arg).to.equal(2);
	});
	it("multiple arg mixed primitive/object cached",function() {
		const arg1 = 1,
			arg2 = {arg:2},
		result = multipleArg(arg1, arg2);
		expect(result.arg1).to.equal(arg1);
		expect(result.arg2).to.equal(arg2);
	});
	it("multiple arg null cached",function() {
		const arg1 = null,
			arg2 = null,
		result = multipleArg(arg1,arg2);
		expect(result.arg1).to.equal(arg1);
		expect(result.arg2).to.equal(arg2);
	});
	it("multiple arg works with single",function() {
		const arg1 = {arg:1};
		result = multipleArg(arg1);
		expect(result.arg1.arg).to.equal(1);
	});
	it("multiple varg mixed length",function() {
		const res1 = varArg("multi1", "multi2");
		const res2 = varArg("multi1");
		expect(res1.length).to.equal(2);
		expect(res2.length).to.equal(1);
	});
	it("zero varg cached", function() {
		const res1 = varArg();
		const res2 = varArg("multi3");
		const res3 = varArg();
		expect(res1.length).to.equal(0);
		expect(res2.length).to.equal(1);
		expect(res3.length).to.equal(0);
	});
	it("callTimeout",function(done) {
		const callTimeout = nanomemoize(function(a,b,cb) { var result = a + b; cb(result); return result; },{maxArgs:2,callTimeout:10});
		let result = 0;
		const res1 = callTimeout(1,2,(value) => result = value + 1);
		expect(res1).to.equal(3);
		setTimeout(() => {
			expect(result).to.equal(4);
			done();
		},100)
	});
	it("maxAge - flush cache",function(done) {
			const memoized = nanomemoize((a,b) => a + b,{maxAge: 100})
			let keys = memoized.keys(),
				values = memoized.values();
			expect(keys.length).to.equal(0);
			expect(values.length).to.equal(0);
			const response = memoized(1,2);
			expect(response).to.equal(3);
			keys = memoized.keys();
			values = memoized.values();
			expect(keys.length).to.equal(1);
			expect(keys[0][0]).to.equal(1);
			expect(keys[0][1]).to.equal(2);
			expect(values.length).to.equal(1);
			expect(values[0]).to.equal(3);
			setTimeout(() => {
				let keys = memoized.keys(),
					values = memoized.values();
				expect(keys.length).to.equal(0); // cache cleared
				expect(values.length).to.equal(0); // cache cleared
				const response = memoized(1,3);
				expect(response).to.equal(4);
				keys = memoized.keys();
				values = memoized.values();
				expect(keys.length).to.equal(1); // new cache value
				expect(keys[0][0]).to.equal(1);
				expect(keys[0][1]).to.equal(3);
				expect(values.length).to.equal(1);
				expect(values[0]).to.equal(4);
				done();
			},1000)
	});
	it("auto-detect vArg",function() {
		const arg1 = 1, arg2 = 2;
		expect(Array.isArray(varArg.values())).to.equal(true);
		expect(Array.isArray(varArg(arg1,arg2))).to.equal(true);
	});
	it("expires content single primitive",function(done) {
		const expiring = nanomemoize(function(a) { return a; },{maxAge:5});
		expect(expiring(1)).to.equal(1);
		expect(expiring.values()[0]).to.equal(1);
		setTimeout(function()  {
			expect(expiring.values()[0]).to.equal(undefined);
			done();
		},20)
	});
	it("expires content single object",function(done) {
		const expiring = nanomemoize(function(a) { return a; },{maxAge:5}),
			o = {}
		expect(expiring(o)).to.equal(o);
		expect(expiring.values()[0]).to.equal(o);
		setTimeout(function() {
			expect(expiring.values()[0]).to.equal(undefined);
			done();
		},20)
	});
	it("expires content multiple",function(done) {
		const expiring = nanomemoize(function(a,b) { return {a:a,b:b}; },{maxAge:5}),
			result = expiring(1,2);
		expect(result.a).to.equal(1);
		expect(result.b).to.equal(2);
		expect(expiring.values()[0].a).to.equal(1);
		expect(expiring.values()[0].b).to.equal(2);
		setTimeout(function() {
			expect(expiring.values()[0]).to.equal(undefined);
			done();
		},20)
	});
	it("optional equal - deepEquals",function() {
		const optionalEqual = nanomemoize(function(a,b) { return [a,b]; },{equals:deepEquals}),
			[a1,a2] = optionalEqual({a:1}, {a:1}),
			values = optionalEqual.values();
		expect(deepEquals(a1,a2)).to.equal(true);
		expect(values[0].length).to.equal(2);
		expect(deepEquals(values[0][0],a1)).to.equal(true);
		expect(deepEquals(values[0][1],a2)).to.equal(true);
	})
	it("optional equal - fastDeepEquals",function() {
		const optionalEqual = nanomemoize(function(a,b) { return [a,b]; },{equals:fastDeepEqual}),
			[a1,a2] = optionalEqual({a:1}, {a:1}),
			values = optionalEqual.values();
		expect(fastDeepEqual(a1,a2)).to.equal(true);
		expect(values[0].length).to.equal(2);
		expect(fastDeepEqual(values[0][0],a1)).to.equal(true);
		expect(fastDeepEqual(values[0][1],a2)).to.equal(true);
	})
});
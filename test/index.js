var chai,
	expect,
	nanomemoize;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	nanomemoize = require("../src/nano-memoize.js");
}

function singleArg(arg) {
	return arg;
}

function multipleArg(arg1,arg2) {
	return {arg1,arg2};
}

singleArg = nanomemoize(singleArg);

multiplArg = nanomemoize(multipleArg);

varArg = nanomemoize((...args) => args);


describe("Test",function() {
	it("single primitive arg cached",function() {
		const value = 1,
			result = singleArg(value),
			keyvalues = singleArg.keyValues();
		expect(result).to.equal(value);
		expect(keyvalues[value]).to.equal(value);
	});
	it("single object arg cached",function() {
		const value = {p1:1},
			result = singleArg(value);
		expect(result).to.equal(value);
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
	it("multiple arg works with single",function() {
		const arg1 = {arg:1};
		result = multipleArg(arg1);
		expect(result.arg1.arg).to.equal(1);
	});
	it("auto-detect vArg",function() {
		const arg1 = 1, arg2 = 2;
		expect(varArg.keyValues()).to.equal(null);
		expect(Array.isArray(varArg.values())).to.equal(true);
		expect(Array.isArray(varArg(arg1,arg2))).to.equal(true);
	});
	it("expires content single",function(done) {
		const expiring = nanomemoize((a) => a,{maxAge:5});
		expect(expiring(1)).to.equal(1);
		expect(expiring.keyValues()[1]).to.equal(1);
		setTimeout(() => {
			expect(expiring.keyValues()[1]).to.equal(undefined);
			done();
		},20)
	});
	it("expires content multiple",function(done) {
		const expiring = nanomemoize((a,b) => { return {a,b}; },{maxAge:5}),
			result = expiring(1,2);
		expect(result.a).to.equal(1);
		expect(result.b).to.equal(2);
		expect(expiring.values()[0].a).to.equal(1);
		expect(expiring.values()[0].b).to.equal(2);
		setTimeout(() => {
			expect(expiring.values()[0]).to.equal(undefined);
			done();
		},20)
	});
	it("clear cache",function() {
		const value = 1;
		expect(singleArg(value)).to.equal(value);
		expect(singleArg.keyValues()[value]).to.equal(value);
		singleArg.clear();
		expect(singleArg.keyValues()[value]).to.equal(undefined);
		expect(singleArg(value)).to.equal(value);
		expect(singleArg.keyValues()[value]).to.equal(value);
	});
});
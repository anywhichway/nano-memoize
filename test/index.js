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
	return {arg1:arg1,arg2:arg2};
}

singleArg = nanomemoize(singleArg);

multiplArg = nanomemoize(multipleArg);

varArg = nanomemoize(function() { return [].slice.call(arguments); });

callTimeout = nanomemoize(function(a,b,cb) { var result = a + b; cb(result); return result; },{maxArgs:2,callTimeout:0});

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
			keyvalues = singleArg.keyValues().primitives;
		expect(result).to.equal(value);
		expect(keyvalues[value]).to.equal(value);
	});
	it("single primitive string arg cached",function() {
		const value = "1",
			result = singleArg(value),
			keyvalues = singleArg.keyValues().primitives;
		expect(result).to.equal(value);
		expect(keyvalues[JSON.stringify(value)]).to.equal(value);
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
		expect(res1).to.not.equal(res2);
	});
	it("callTimeout",function(done) {
		let result = 0;
		const res1 = callTimeout(1,2,(value) => result = value + 1);
		expect(res1).to.equal(3);
		setTimeout(() => {
			expect(result).to.equal(4);
			done();
		},100)
	});
	it("auto-detect vArg",function() {
		const arg1 = 1, arg2 = 2;
		expect(varArg.keyValues()).to.equal(null);
		expect(Array.isArray(varArg.values())).to.equal(true);
		expect(Array.isArray(varArg(arg1,arg2))).to.equal(true);
	});
	it("expires content single primitive",function(done) {
		const expiring = nanomemoize(function(a) { return a; },{maxAge:5});
		expect(expiring(1)).to.equal(1);
		expect(expiring.keyValues().primitives[1]).to.equal(1);
		setTimeout(function()  {
			expect(expiring.keyValues().primitives[1]).to.equal(undefined);
			done();
		},20)
	});
	it("expires content single object",function(done) {
		const expiring = nanomemoize(function(a) { return a; },{maxAge:5}),
			o = {}
		expect(expiring(o)).to.equal(o);
		expect(expiring.keyValues().objects.get(o)).to.equal(o);
		setTimeout(function() {
			expect(expiring.keyValues().objects.get(o)).to.equal(undefined);
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
	it("clear cache",function() {
		const value = 1;
		expect(singleArg(value)).to.equal(value);
		expect(singleArg.keyValues().primitives[value]).to.equal(value);
		singleArg.clear();
		expect(singleArg.keyValues().primitives[value]).to.equal(undefined);
		expect(singleArg(value)).to.equal(value);
	});
});
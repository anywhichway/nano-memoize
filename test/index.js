var chai,
	expect,
	nanomemoize;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	tlx = require("../src/nano-memoize.js");
}

function singleArg(arg) {
	return arg;
}

function multipleArg(arg1,arg2) {
	return {arg1,arg2};
}

singleArg = nanomemoize(singleArg);

multiplArg = nanomemoize(multipleArg);

describe("Test",function() {
	it("single primitive arg cached",function() {
		const value = 1,
			result = singleArg(value),
			keyvalues = singleArg.keyValues();
		expect(result).to.equal(value);
		expect(keyvalues[value]).to.equal(value);
	});
});
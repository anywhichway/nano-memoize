function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "nanomemoize", () => $4fa36e821943b400$export$22f15dd4e5be7e52);
$parcel$export(module.exports, "default", () => $4fa36e821943b400$export$22f15dd4e5be7e52);
/*
MIT License

Copyright (c) 2018-2023 Simon Y. Blackwell

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
*/ var $4fa36e821943b400$var$assign = Object.assign;
if (typeof $4fa36e821943b400$var$assign !== "function") $4fa36e821943b400$var$assign = function() {
    var a = arguments, o = arguments[0];
    if (o === null || o === undefined) throw new TypeError("Cannot convert undefined or null to object");
    o = Object(o);
    for(var i = 1; i < a.length; i++){
        if (a[i] && typeof a[i] === "object") for(var k in a[i])o[k] = a[i][k];
    }
    return o;
};
function $4fa36e821943b400$var$vrgs(f) {
    var s = f + "", i = s.indexOf("...");
    return i >= 0 && (i < s.indexOf(")") || s.indexOf("arguments") >= 0);
}
function $4fa36e821943b400$export$22f15dd4e5be7e52(fn, o) {
    /*o = {
		serializer, // used to serialize arguments of single argument functions, multis are not serialized
		equals, // equality tester, will force use of slower multiarg approach even for single arg functions
		maxAge, // max cache age is ms, set > 0 && < Infinity if you want automatic clearing
		maxArgs, // max args to use for signature
		vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default is best attempt at infering
	  } = {}
	*/ o || (o = {});
    var vargs = o.vargs || $4fa36e821943b400$var$vrgs(fn), s = Object.create(null), k = [], v = [], z, cache = new Map(), d = function(key, c, k) {
        return setTimeout(function() {
            if (k) {
                c.splice(key, 1);
                k.splice(key, 1);
                return;
            } // dealing with single arg function, c is a WekMap or Object
            c instanceof Map ? c.delete(key) : delete c[key];
        }, o.maxAge);
    }, c = o.maxAge > 0 && o.maxAge < Infinity ? d : 0, eq = o.equals ? o.equals : function(a, b) {
        return a === b;
    }, maxargs = o.maxArgs, srlz = o.serializer, f, u; // flag indicating a unary arg function is in use for clear operation
    if (fn.length === 1 && !o.equals && !vargs) {
        // for single argument functions, just use a Map lookup
        f = function(a) {
            if (srlz) a = srlz(a);
            var r;
            return cache.get(a) || (!c || c(a, cache), cache.set(a, r = fn.call(this, a)), r);
        };
        u = 1;
    } else // for multiple arg functions, loop through a cache of all the args
    // looking at each arg separately so a test can abort as soon as possible
    f = function() {
        var l = maxargs || arguments.length, kl = k.length, i = -1;
        while(++i < kl){
            var args = k[i];
            if (maxargs != null || args.length === l) {
                var j = 0;
                while(j < l && eq(arguments[j], args[j]))j++;
                if (j === l) return v[i];
                 // the args matched;
            }
        }
        // set change timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
        return !c || c(i, v, k), v[i] = fn.apply(this, k[i] = arguments);
    };
    // reset all the caches
    f.clear = function() {
        cache.clear();
        s = Object.create(null);
        k = [];
        v = [];
        z = undefined;
    };
    f.keys = function() {
        return u ? [
            ...cache.keys()
        ] : k.slice();
    };
    f.values = function() {
        return u ? [
            ...cache.values()
        ] : v.slice();
    };
    return f;
}


//# sourceMappingURL=nano-memoize.js.map

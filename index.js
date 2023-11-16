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
*/ function $cf838c15c8b009ba$var$vrgs(f) {
    var s = f + "", i = s.indexOf("...");
    return i >= 0 && (i < s.indexOf(")") || s.indexOf("arguments") >= 0);
}
function $cf838c15c8b009ba$export$22f15dd4e5be7e52(fn, o) {
    /*o = {
		serializer, // used to serialize arguments of single argument functions, multis are not serialized
		equals, // equality tester, will force use of slower multiarg approach even for single arg functions
		maxAge, // max cache age is ms, set > 0 && < Infinity if you want automatic clearing
		maxArgs, // max args to use for signature
		vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default is best attempt at infering
	  } = {}
	*/ o || (o = {});
    var vargs = o.vargs || $cf838c15c8b009ba$var$vrgs(fn), k = [], cache = new Map(), u, to, d = function(key) {
        return to = setTimeout(function() {
            if (u) {
                cache.delete(key);
                return;
            }
            // dealing with multi-arg function, c and k are Arrays
            k.splice(key, 1);
        //v.splice(key,1);
        }, o.maxAge);
    }, c = o.maxAge > 0 && o.maxAge < Infinity ? d : 0, eq = o.equals ? o.equals : 0, maxargs = o.maxArgs, srlz = o.serializer, f; // memoized function to return
    if (fn.length === 1 && !o.equals && !vargs) {
        // for single argument functions, just use a Map lookup
        f = function(a) {
            if (srlz) a = srlz(a);
            var r;
            return cache.get(a) || (!c || c(a), cache.set(a, r = fn.call(this, a)), r);
        };
        u = 1;
    } else if (eq) // for multiple arg functions, loop through a cache of all the args
    // looking at each arg separately so a test can abort as soon as possible
    f = function() {
        var l = maxargs || arguments.length, kl = k.length, i = -1;
        while(++i < kl)if (k[i].length === l) {
            var j = -1;
            while(++j < l && eq(arguments[j], k[i][j])); // compare each arg
            if (j === l) return k[i].val //the args matched;
            ;
        }
        // set change timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
        k[i] = arguments;
        return !c || c(i), arguments.val = fn.apply(this, k[i]);
    };
    else f = function() {
        var l = maxargs || arguments.length, kl = k.length, i = -1;
        while(++i < kl)if (k[i].length === l) {
            var j = -1;
            while(++j < l && arguments[j] === k[i][j]); // compare each arg
            if (j === l) return k[i].val //the args matched;
            ;
        }
        // set change timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
        k[i] = arguments;
        return !c || c(i), arguments.val = fn.apply(this, k[i]);
    };
    // reset all the caches
    f.clear = function() {
        if (to) clearTimeout(to);
        cache.clear();
        k = [];
    };
    f.keys = function() {
        return u ? [
            ...cache.keys()
        ] : k.slice();
    };
    f.values = function() {
        return u ? [
            ...cache.values()
        ] : k.map((args)=>args.val);
    };
    return f;
}


export {$cf838c15c8b009ba$export$22f15dd4e5be7e52 as nanomemoize, $cf838c15c8b009ba$export$22f15dd4e5be7e52 as default};
//# sourceMappingURL=index.js.map

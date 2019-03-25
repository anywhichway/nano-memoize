(function() {
	"use strict";
	const vrgs = f => {
			const s = f+"",
				i = s.indexOf("...");
			return i>=0 && i<s.indexOf(")" || s.indexOf("arguments")>=0);
		},
		nanomemoize = (fn, {
			serializer = value => JSON.stringify(value), // used to serialize arguments of single argument functions, multis are not serialized
			equals, // equality tester, will force use of slower multiarg approach even for single arg functions
			maxAge, // max cache age is ms, set higher than 0 if you want automatic clearing
			maxArgs, // max args to use for signature
			vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default if best attempt at infering
		}={}) => {
			const s = Object.create(null), // single arg function key/value cache
				k = [], // multiple arg function arg key cache
				v = [], // multiple arg function result cache
				d = (key,m) => setTimeout(() => m ? delete v[key] : delete s[key],maxAge),
				I = Infinity;
			let f, // memoized function to return
				u; // flag indicating a unary arg function is in use
			if(fn.length===1 && !equals && !vargs) {
				// for single argument functions, just use a JS object key look-up
				// f = original function
				// s = result cache
				// c = cache change timeout
				// p = arg serializer
				// a = the arguments
				f =  (function(f,s,c,p,a) { // pre-bind core arguments, faster than using a closure or passing on stack
						  // strings must be serialized because cache[1] should not equal or overwrite cache["1"] for value = 1 and value = "1"
							const t = typeof a,
								key = !a || t === "number" || t === "boolean" ? a : p(a);
							// set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
							return s[key] || ((!c||c(key)),s[key] = fn.call(this, a));
						}).bind(
							 this,
							 fn,
							 s,
							 maxAge && maxAge<I ? p => d(p) : 0,
							 serializer
							 );
						u = 1;
			} else {
				// for multiple arg functions, loop through a cache of all the args
				// looking at each arg separately so a test can abort as soon as possible
				// f = original function
				// k = arg cache
				// v = results cache
				// e = equality tester
				// c = cache change timeout
				// m = maxArgs
				// ...a = the arguments
				f = (function(f,k,v,e,c,m,...a) {
							const	l = m||a.length;
							let i;
							for(i=0;i<k.length;i++) { // an array of arrays of args, each array represents a call signature
								let p = k[i];
								if(p && p.length===a.length) {
									for(let j=0;j<=l;j++) {
										if(e ? !e(p[j],a[j]) : p[j]!==a[j]) break; // go to next call signature if args don't match
										if(j===l) { // the args matched
											if(v[i]!==undefined) return v[i];
										}
									}
								}
							}
							// set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
							if(c) c(i);
							return v[i] = fn.apply(this,k[i] = a);
						}).bind(
								 this,
								 fn,
								 k,
								 v,
								 equals,
								 maxAge && maxAge<I ? p => d(p,1) : 0, 
								 maxArgs
								 );
			}
			// reset all the caches, must change array length or delete keys on objects to retain bind integrity
			f.clear = _ => {
				Object.keys(s).forEach(k => delete s[k]);
				k.length = 0;
				v.length = 0; 
			};
			f.keys = _ => u ? null : k.slice();
			f.values = _ => u ? null : v.slice();
			f.keyValues = _ => u ? Object.assign({},s) : null;
			return f;
		}
	if(typeof(module)!=="undefined") module.exports = nanomemoize;
	if(typeof(window)!=="undefined") window.nanomemoize = nanomemoize;
}).call(this);


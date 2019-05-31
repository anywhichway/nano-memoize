(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function() {
	var vrgs = f => {
			var s = f+"",
				i = s.indexOf("...");
			return i>=0 && i<s.indexOf(")" || s.indexOf("arguments")>=0);
		},
		nanomemoize = (fn, {
			serializer, // used to serialize arguments of single argument functions, multis are not serialized
			equals, // equality tester, will force use of slower multiarg approach even for single arg functions
			maxAge, // max cache age is ms, set > 0 && < Infinity if you want automatic clearing
			maxArgs, // max args to use for signature
			vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default if best attempt at infering
		}={}) => {
			var s = Object.create(null), // single arg function key/value cache
				k = [], // multiple arg function arg key cache
				v = [], // multiple arg function result cache
				wm = {m:new WeakMap()},
				d = (key,c) => setTimeout(() => { 
						c instanceof WeakMap  ? c.delete(key) : delete c[key] 
					},maxAge),
				I = Infinity,
				f, // memoized function to return
				u; // flag indicating a unary arg function is in use for clear operation
			if(fn.length===1 && !equals && !vargs) {
				// for single argument functions, just use a JS object key look-up
				// f = original function
				// s = result cache
				// wm = weakmap
				// c = cache change timeout
				// p = arg serializer
				// a = the arguments
				f =  (function(f,s,wm,c,p,a) { // pre-bind core arguments, faster than using a closure or passing on stack
						  // strings must be serialized because cache[1] should not equal or overwrite cache["1"] for value = 1 and value = "1"
							var t = typeof a;
							// set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
							if(!p && (t==="object"  || t==="function")) {
								var r;
								return wm.m.get(a) || ((!c||c(a,wm.m)),wm.m.set(a,r = fn.call(this, a)),r);
							}
							var key = t === "number" || t === "boolean" || t==="undefined" ? a : t === "string" ? JSON.stringify(a) : p(a);
							return s[key] || ((!c||c(key,s)),s[key] = fn.call(this, a));
						}).bind(
							 this,
							 fn,
							 s,
							 wm,
							 maxAge>0 && maxAge<I ? d : 0,
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
							var i,j,l = m||a.length; // use var, slightly smaller and faster for loops, and i needs more scope
							for(i=0;i<k.length && v[i]!==undefined;i++) { // an array of arrays of args, each array represents a call signature
								for(j=0;j<=l && (k[i][j]===a[j] || (e && e(k[i][j],a[j])));j++) {	// compare each arg									//if(p[j]!==a[j] && (!e || !e(p[j],a[j]))) break; // go to next call signature if args don't match
									if(j===l) return v[i]; // the args matched
								}
							}
							// set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
							!c||c(i,v);
							return v[i] = fn.apply(this,k[i] = a);
						}).bind(
								 this,
								 fn,
								 k,
								 v,
								 equals,
								 maxAge>0 && maxAge<I ? d : 0, 
								 maxArgs
								 );
			}
			// reset all the caches, must change array length or delete keys on objects to retain bind integrity
			f.clear = _ => {
				Object.keys(s).forEach(k => delete s[k]);
				wm.m = new WeakMap();
				k.length = 0;
				v.length = 0; 
			};
			f.keys = _ => u ? null : k.slice();
			f.values = _ => u ? null : v.slice();
			f.keyValues = _ => u ? {primitives:Object.assign({},s),objects:wm.m} : null;
			return f;
		}
	if(typeof(module)!=="undefined") module.exports = nanomemoize;
	if(typeof(window)!=="undefined") window.nanomemoize = nanomemoize;
}).call(this);


},{}]},{},[1]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	"use strict";
	const vrgs = f => {
			const s = f+"",
				i = s.indexOf("...");
			return i>=0 && i<s.indexOf(")" || s.indexOf("arguments")>=0);
		},
		nanomemoize = (fn, {
			serializer, // used to serialize arguments of single argument functions, multis are not serialized
			equals, // equality tester, will force use of slower multiarg approach even for single arg functions
			maxAge, // max cache age is ms, set higher than 0 if you want automatic clearing
			maxArgs, // max args to use for signature
			vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default if best attempt at infering
		}={}) => {
			const s = Object.create(null), // single arg function key/value cache
				k = [], // multiple arg function arg key cache
				v = [], // multiple arg function result cache
				wm = {m:new WeakMap()},
				d = (key,c) => setTimeout(() => { 
						c instanceof WeakMap  ? c.delete(key) : delete c[key] 
					},maxAge),
				I = Infinity;
			let f, // memoized function to return
				u; // flag indicating a unary arg function is in use
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
							const t = typeof a,
								key = t === "number" || t === "boolean" || (!p && t === "object") ? a : t === "string" ? JSON.stringify(t) : p(a);
							// set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
							if(!p && t==="object") {
								let r;
								return wm.m.get(key) || ((!c||c(key,wm.m)),wm.m.set(key,r = fn.call(this, a)),r);
							}	
							return s[key] || ((!c||c(key,s)),s[key] = fn.call(this, a));
						}).bind(
							 this,
							 fn,
							 s,
							 wm,
							 maxAge && maxAge<I ? d : 0,
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
							if(c) c(i,v);
							return v[i] = fn.apply(this,k[i] = a);
						}).bind(
								 this,
								 fn,
								 k,
								 v,
								 equals,
								 maxAge && maxAge<I ? d : 0, 
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

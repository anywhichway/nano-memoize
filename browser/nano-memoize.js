(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	"use strict";
	const hsVrgs = (f) => {
		const s = f+"",
			i = s.indexOf("...");
		return i>=0 && i<s.indexOf(")" || s.indexOf("arguments")>=0);
		};
	function nanomemoize (fn, options={}) {
		const {
			serializer = (value) => JSON.stringify(value),
			equals,
			maxAge,
			maxArgs,
			vargs = hsVrgs(fn)
		} = options,
			s = {}, // single arg function key/value cache
			k = [], // multiple arg function arg key cache
			v = []; // multiple arg function result cache
		// for single argument functions, just use a JS object key look-up
		function sngl (f,s,chng,serializer,arg) {
		  // strings must be stringified because cache[1] should not equal or overwrite cache["1"] for value = 1 and value = "1"
			const key = (!arg || typeof arg === "number" || typeof arg ==="boolean" ? arg : serializer(arg));
			if(chng) chng(key);
			return s[key] || (s[key] = f.call(this, arg));
		}
		// for multiple arg functions, loop through a cache of all the args
		// looking at each arg separately so a test can abort as soon as possible
		function mltpl(f,k,v,eq,chng,max=0,...args) {
			const rslt = {};
			for(let i=0;i<k.length;i++) { // an array of arrays of args
				let key = k[i];
				if(max) { key = key.slice(0,max); }
				if(key.length===args.length || (max && key.length<args.length)) {
					const max = key.length - 1;
					for(let j=0;j<=max;j++) {
						if(!eq(key[j],args[j])) { break; } // go to next key if args don't match
						if(j===max) { // the args matched
							rslt.i = i;
							rslt.v = v[i]; // get the cached value
						}
					}
				}
			}
			const i = rslt.i>=0 ? rslt.i : v.length;
			if(chng) chng(i);
			return typeof rslt.v === "undefined" ? v[i] = f.call(this,...(k[i] = args)) : rslt.v;
		}
		let m,
			unry = fn.length===1 && !equals && !vargs;
	  // pre-bind core arguments, faster than using a closure or passing on stack or in this case using a partial
		if(unry) {
			m = sngl.bind(
				 this,
				 fn,
				 s,
				 maxAge ? (key) => setTimeout(() => { delete s[key];	},maxAge) : null,
				 serializer
				 );
		} else {
			m = mltpl.bind(
					 this,
					 fn,
					 k,
					 v,
					 equals || ((a,b) => a===b), // default to just a regular strict comparison
					 maxAge ? (key) => setTimeout(() => { delete v[key];	},maxAge) : null,
					 maxArgs
					 );
		}
		// reset all the caches, must chng array length or delete keys on objects to retain bind integrity
		m.clear = () => {
			Object.keys(s).forEach((k) => delete s[k]);
			k.length = 0;
			v.length = 0; 
		};
		m.keys = () => (!unry ? k.slice() : null);
		m.values = () => (!unry ? v.slice() : null);
		m.keyValues = () => (unry ? Object.assign({},s) : null);
		return m;
	}
	if(typeof(module)!=="undefined") module.exports = nanomemoize;
	if(typeof(window)!=="undefined") window.nanomemoize = nanomemoize;
}).call(this);


},{}]},{},[1]);

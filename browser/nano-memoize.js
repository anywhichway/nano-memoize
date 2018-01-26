(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	"use strict";

	function nanomemoize (fn, options={}) {
		const {
			serializer = (value) => { 
				if(value && (typeof value === "string" || typeof value === "object")) {
					return JSON.stringify(value);
				}
				return value;
			},
			equals,
			maxAge,
			maxArgs,
			maxSize
		} = options,
			singles = {},
			keys = [],
			values = [],
			changes = [],
			change = (cache,key,property) => {
				if(property) key = typeof(key) + "@" + key;
				changes[key] = {key,cache};
			},
			timeouts =  [],
			timeout = (key,cache,property) => {
				if(property) key = typeof(key) + "@" + key;
				if(timeouts[key]) clearTimeout(timeouts[key]);
				timeouts[key] = setTimeout(() => cache[key]=timeouts[key]=null,maxAge);
			};
		let memoized;
		if(fn.length===1 && !equals) {
			memoized = single.bind(
				 this,
				 fn,
				 singles,
				 (maxSize || maxAge ? change.bind(this,values): null),
				 serializer
				 );
		} else {
			memoized = multiple.bind(
					 this,
					 fn,
					 keys,
					 values,
					 serializer,
					 equals || ((a,b) => a===b),
					 (maxSize || maxAge ? change.bind(this,values): null),
					 maxArgs
					 );
		}
		memoized.clear = () => {
			Object.keys(singles).forEach(key => delete singles[key]);
			keys.splice(0,keys.length);
			values.splice(0,values.length);
			changes.splice(0,changes.length);
			Object.keys(changes).forEach(key => key==="length" || delete changes[key]);
			timeouts.forEach(timeout => !timeout || clearTimeout(timeout));
			timeouts.splice(0,timeouts.length);
			Object.keys(timeouts).forEach(key => key==="length" || delete timeouts[key]);
		}
		memoized.keys = () => keys.slice();
		memoized.values = () => values.slice();
		memoized.keyValues = () => Object.assign({},singles);
		return memoized;
	}

	function single (f,cache,change,serializer,arg) {
		if(arguments.length<=5) {
			const key = (!arg || typeof arg === "number" || typeof arg ==="boolean" ? arg : serializer(arg));
			if(change) change(key,true);
			return cache[key] || ( cache[key] = f.call(this, arg));
		}
	}
	function multiple(f,keys,values,serializer,equals,change,maxArgs,...args) {
		const result = {};
		for(let i=0;i<keys.length;i++) {
			let key = keys[i];
			if(key===null) { result.index = i; continue; }
			if(maxArgs) key = key.slice(0,maxArgs);
			if(key.length===args.length) {
				const max = key.length - 1;
				for(let j=0;j<=max;j++) {
					if(!equals(key[j],args[j])) break;
					if(j===max) {
						result.index = i;
						result.value = values[i];
					}
				}
			}
		}
		const i = result.index>=0 ? result.index : values.length;
		if(change) change(key,true);
		return typeof result.value === "undefined" ? result.value = values[i] = f(...(keys[i] = args)) : result.value;
	}
		
		if(typeof(module)!=="undefined") module.exports = nanomemoize;
		if(typeof(window)!=="undefined") window.nanomemoize = nanomemoize;
}).call(this);


},{}]},{},[1]);

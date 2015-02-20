import Immutable from 'immutable'

export function define(obj, key, value) {
	Object.defineProperty(obj, key, {
		  value:value
		, writable:false
		, enumerable:true
	})
}

export function updateProxy(Ref, fns) {
	fns.forEach(function(fn) {
		Ref.prototype[fn] = function() {
			var args = arguments
			return this.set(function(val) {
				return val[fn](...args)
			})
		}
	})
}

export function proxy(Ref, fns) {
	fns.forEach(function(fn) {
		Ref.prototype[fn] = function() {
			return this._current[fn].apply(this._current, arguments)
		}
	})
}

export function nextFrame(fn) {
	if(typeof requestAnimationFrame === 'function')
		return requestAnimationFrame(fn)

	setTimeout(fn, 0)
}

export function getPath(obj, path) {
	var ref = obj
	path.forEach(function(key) {
		ref = ref[key]
	})
	return ref
}

export function pathsEqual(p1, p2) {
	if(p1.length != p2.length)
		return false

	return p1.every(function(part, i) {
		return part == p2[i]
	})
}

export function combinePaths(p1, p2) {
	if(typeof p2 == 'string')
		p2 = p2.split('.')

	if(!p2 || !p2.length) return p1

	return [].concat(p1).concat(p2)
}

export function getImmutable(data) {
	if(isImmutable(data)) 
		return data
	
	return Immutable.fromJS(data)
}

export function isImmutable(data) {
	return Immutable.Iterable.isIterable(data) || isPrimitive(data)
}

export function isPrimitive(data) {
	var Sym = typeof Symbol === 'function' && Symbol

	return data === null 
		|| data === undefined 
		|| !!~[String, Number, Boolean, Sym].indexOf(data.constructor)
}
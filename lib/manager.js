import Reference from './reference'
import { getPath } from './util'
import { nextFrame } from './util'
import { getImmutable } from './util'

export default class Manager {
	constructor(val, fn) {
		this.val = val = getImmutable(val)
		this.reference = new Reference(this, [], val)
		this._handlers = {}

		if(fn) this._handlers[''] = [fn]
	}
	bind(path, handler) {
		if(typeof path === 'function') {
			handler = path
			path = ''
		}

		this._handlers[path] = this._handlers[path] || []
		this._handlers[path].push(handler)
	}
	unbind(path, handler) {
		if(typeof path === 'function') {
			handler = path
			path = ''
		}

		var handlers = this._handlers[path]

		if(!handlers) return false

		return handlers.some(function(fn, i) {
			if(fn == handler) {
				handlers.splice(i, 1)
				return true
			}
		})
	}
	_set(path, val, ref) {
		if(!this.hasOwnProperty('_next'))
			this._prepare()
		
		this._next = this._next || this.val

		val = getImmutable(val)

		if(!path.length) this._next = val
		else this._next = this._next.setIn(path, val)

		return new Reference(this, path, val, ref)
	}
	_apply(path, fn, args, ref) {
		var current

		if(!this.hasOwnProperty('_next'))
			this._prepare()
		
		this._next = this._next || this.val
		current = path.length ? this._next.getIn(path) : this._next
		current = current[fn].apply(current, args)
		this._next = path.length ? this._next.setIn(path, current) : current

		return new Reference(this, path, current, ref)
	}
	_prepare() {
		var manager = this
		nextFrame(function() {
			var prev = manager.val
			  , val = manager.val = manager._next
			  , handlers = manager._handlers
			  , paths = Object.keys(handlers)
			  , reference 
			
			delete manager._next

			if(val === prev) return

			reference = manager.reference = new Reference(manager, [], val, manager.reference)
			
			paths.forEach(function(path) {
				var pathArray = path ? path.split('.') : []
				  , subReference

				if(path.length && prev.getIn(pathArray) == next.getIn(pathArray))
					return

				subReference = getPath(reference, pathArray)

				handlers[path].forEach(function(fn) { fn(subReference) })
			})
		})
	}
}
import Reference from './reference'
import { getPath } from './util'
import { nextFrame } from './util'

export default class Manager {
	constructor(val, fn) {
		this.val = val
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
	set(path, val, ref) {
		if(ref != getPath(this.val, path))
			throw new Error('This reference is out of date. It cannot be updated.')

		if(!this.hasOwnProperty('_next'))
			this._prepare()

		this._next = this._next || []
		this._next.push({ path, val })

		return ref || this
	}
	_prepare() {
		var manager = this
		nextFrame(function() {
			var prev = manager.val
			  , handlers = manager._handlers
			  , paths = Object.keys(handlers)
			  , reference = manager.reference
			  , val

			val = manager.val/* = prev.withMutations(function(val) {
				manager._next.forEach(function({ path, val:subval }) {
					if(typeof subval === 'function') {
						subval = subval(path.length ? val.getIn(path) : val)
					}
					val.setIn(path, subval)
				})
			})*/

			delete manager._next

			if(val === prev) return

			reference = manager.reference = new Reference(manager, [], val, reference)
			
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
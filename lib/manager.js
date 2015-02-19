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
		if(ref.val() != (path.length ? this.val.getIn(path) : this.val))
			throw new Error('This reference is out of date. It cannot be updated.')

		if(!this.hasOwnProperty('_next'))
			this._prepare()
		
		val = getImmutable(val)

		this._next = this._next || []
		this._next.push({ action:'set', path, val })

		return ref
	}
	_apply(path, fn, args, ref) {
		if(ref.val() != (path.length ? this.val.getIn(path) : this.val))
			throw new Error('This reference is out of date. It cannot be updated.')

		if(!this.hasOwnProperty('_next'))
			this._prepare()

		this._next = this._next || []
		this._next.push({ action:'apply', path, fn, args })

		return ref
	}
	_prepare() {
		var manager = this
		nextFrame(function() {
			var prev = manager.val
			  , handlers = manager._handlers
			  , paths = Object.keys(handlers)
			  , reference 
			  , val
			
			val = manager.val = prev.withMutations(function(val) {
				manager._next.forEach(function(change) {
					if(change.action === 'apply') {
						change.val = (
							change.path.length ? val.getIn(change.path) : val
						)[change.fn](...change.args)
					}
					val.setIn(change.path, change.val)
				})
			})

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
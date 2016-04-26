import Reference from '../reference'
import { updateProxy } from '../util'
import { getImmutable } from '../util'
import { defineProp } from '../util'
import { combinePaths } from '../util'

export default class ListReference extends Reference {
	constructor(manager, path, current, previous) {
		var ref = this

		super(manager, path, current, previous)

		current.forEach(function(val, i) {
			var prev = previous && previous[i]

			if(prev && prev.val() === val)
				return defineProp(ref, i, prev)
			
			defineProp(ref, i, new Reference(manager, combinePaths(path, i), val, prev))
		})
	}
	map(fn) {
		var size = this.val().size
		  , array = []

		for(var i = 0; i < size; i++) {
			array.push(fn(this[i], i))
		}

		return array
	}
	push() {
		var args = [].map.call(arguments, getImmutable)
		return this.set(function(val) {
			return val.push.apply(val, args)
		})
	}
	unshift() {
		var args = [].map.call(arguments, getImmutable)
		return this.set(function(val) {
			return val.unshift.apply(val, args)
		})
	}
}

//List specific persistent changes from Immutable.js 
//(others inherited from IterableReference)
//updateProxy(ListReference, ['push', 'pop', 'unshift', 'shift', 'setSize'])
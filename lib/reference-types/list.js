import IterableReference from './iterable'
import { updateProxy } from '../util'
import { getImmutable } from '../util'

export default class ListReference extends IterableReference {
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
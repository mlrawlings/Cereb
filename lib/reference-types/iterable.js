import Reference from '../reference'
import { combinePaths } from '../util'
import { updateProxy } from '../util'
import { defineProp } from '../util'

export default class IterableReference extends Reference {
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
}

//Iterable persistent changes from Immutable.js
//updateProxy(IterableReference, [/*'set', */'delete', 'clear', 'update', 'merge', 'mergeWith', 'mergeDeep', 'mergeDeepWith'])

//Iterable deep persistent changes from Immutable.js
//updateProxy(IterableReference, ['setIn', 'deleteIn', 'updateIn', 'mergeIn', 'mergeDeepIn'])

//Iterable transient persistent changes from Immutable.js
//updateProxy(IterableReference, ['withMutations', 'asMutable', 'asImmutable'])
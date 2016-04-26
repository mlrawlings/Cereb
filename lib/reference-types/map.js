import Reference from '../reference'
import { defineProp } from '../util'
import { combinePaths } from '../util'

export default class MapReference extends Reference {
	constructor(manager, path, current, previous) {
		var ref = this

		super(manager, path, current, previous)

		Object.keys(current).forEach(function(i) {
			var val = current[i]
			  , prev = previous && previous[i]

			if(prev && prev.val() === val)
				return defineProp(ref, i, prev)
			
			defineProp(ref, i, new Reference(manager, combinePaths(path, i), val, prev))
		})
	}
}
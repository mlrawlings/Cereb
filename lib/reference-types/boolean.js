import Reference from '../reference'

export default class BooleanReference extends Reference {
	neg() {
		return this.set(function(val){
			return !val
		})
	}
}
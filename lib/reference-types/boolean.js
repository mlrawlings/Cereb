import Reference from '../reference'

export default class BooleanReference extends Reference {
	neg() {
		this.set(function(val){
			return !val
		})
	}
}
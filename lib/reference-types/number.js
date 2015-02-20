import Reference from '../reference'

export default class NumberReference extends Reference {
	inc(amount=1) {
		return this.set(function(val) {
			return val+amount
		})
	}
	dec(amount=1) {
		return this.set(function(val) {
			return val-amount
		})
	}
}
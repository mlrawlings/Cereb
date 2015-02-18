import Reference from '../reference'

export default class NumberReference extends Reference {
	inc(amount=1) {
		this.set(this.val()+amount)
	}
	dec(amount=1) {
		this.set(this.val()-amount)
	}
}
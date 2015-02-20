import Reference from '../reference'

export default class DateReference extends Reference {
	val() {
		return new Date(+super.val())
	}
}
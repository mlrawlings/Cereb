import Reference from './reference'
import Manager from './manager'
import { getImmutable } from './util'

export default class Cereb {
	constructor(val, fn) {
		var manager

		manager = new Manager(val)
		fn && manager.bind(fn)

		return manager.reference
	}
}

Cereb.Reference = Reference
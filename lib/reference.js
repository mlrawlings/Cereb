import Immutable from 'immutable'

export default class Reference {
	constructor(manager, path, current, previous) {
		var TypeReference
		
		if(this.constructor == Reference) {
			TypeReference = Reference.Types[current.constructor]
			if(!TypeReference) {
				throw new Error('unsupported type: '+current+' at path '+path.join('.'))
			}
			return new TypeReference(manager, path, current, previous)
		}

		this._manager = manager
		this._path = path
		this._current = current
	}
	set(val) {
		return this._manager.set(this._path, val, this)
	}
	val() {
		return this._current
	}
	toJSON() {
		return this.val().toJSON()
	}
}

import { default as MapReference } from './reference-types/map'
import { default as ListReference } from './reference-types/list'
import { default as NumberReference } from './reference-types/number'
import { default as StringReference } from './reference-types/string'
import { default as BooleanReference } from './reference-types/boolean'

Reference.Types = {}
Reference.Types[Immutable.Map] = MapReference
Reference.Types[Immutable.List] = ListReference
Reference.Types[Number] = NumberReference
Reference.Types[String] = StringReference
Reference.Types[Boolean] = BooleanReference
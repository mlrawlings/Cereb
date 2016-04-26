import Immutable from 'immutable'
import { getPath } from './util'

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

		Object.defineProperties(this, {
			  _manager: {
				  value:manager
				, writable:false
			  }
			, _path: {
				  value:path
				, writable:false
			  }
			, _current: {
				  value:current
				, writable:false
			  }
		})
	}
	set(val) {
		return this._manager.set(this._path, val, this)
	}
	delete() {
		var path = [].concat(this._path)
		  , key = path.pop()
		  , parent = getPath(this._manager.reference, path)

		console.log(path, key, parent)

		if(!parent || parent[key] != this)
			throw new Error('This reference is out of date. It cannot be updated.')
		
		this._manager.set(path, function(val) {
			return val.delete(key)
		}, parent)

		return this
	}
	val() {
		return this._current
	}
	valueOf() {
		return this._current
	}
	toString() {
		return this._current.toString()
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
import { default as DateReference } from './reference-types/date'

Reference.Types = {}
Reference.Types[Object] = MapReference
Reference.Types[Array] = ListReference
Reference.Types[Number] = NumberReference
Reference.Types[String] = StringReference
Reference.Types[Boolean] = BooleanReference
Reference.Types[Date] = DateReference
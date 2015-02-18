Cereb
=====

Public API
----------

val() //return the value of the current reference

set(key) //set the value of the current reference. if value is a plain javascript structure(array/object) it will be converted to an immutable structure.  Immutable structures may also be passed here.

bind([path, ]handler) //listen to updates on an optional path

unbind([path, ]handler) //stop listening to updates for a specific handler

toJSON() //returns this.val().toJSON()
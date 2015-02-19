var Cereb = require('./index')
  , Immutable = require('immutable')

describe('Performance', function() {
	it('Cereb push x50000', function(done) {
		var a = new Cereb([], function(a) { done() })

		for(var i = 0; i < 50000; i++) {
			a.push(4)
		}
	})
	it('Cereb push x50000 (queue only)', function() {
		var a = new Cereb([])

		for(var i = 0; i < 50000; i++) {
			a.push(4)
		}
	})
	it('Immutable.List push x50000', function() {
		var a = new Immutable.List()

		for(var i = 0; i < 50000; i++) {
			a = a.push(4)
		}
	})
	it('Array push x50000', function() {
		var a = []

		for(var i = 0; i < 50000; i++) {
			a.push(4)
		}
	})

	var obj1024 = {};
	for (var ii = 0; ii < 1024; ii++) {
		obj1024['x' + ii] = ii;
	}

	it('create large object x100', function() {
		for(var i = 0; i < 100; i++) {
			new Cereb(obj1024)
		}
	})
})
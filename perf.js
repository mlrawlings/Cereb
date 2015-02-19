var Cereb = require('./index')
  , Immutable = require('immutable')

describe('Performance', function() {
	describe('push x50000', function() {
		it('Cereb', function(done) {
			var a = new Cereb([], function() { done() })

			for(var i = 0; i < 50000; i++) {
				a.push(4)
			}
		})
		it('Cereb (queue only)', function() {
			var a = new Cereb([])

			for(var i = 0; i < 50000; i++) {
				a.push(4)
			}
		})
		it('Immutable.List', function() {
			var a = new Immutable.List()

			for(var i = 0; i < 50000; i++) {
				a = a.push(4)
			}
		})
		it('Array', function() {
			var a = []

			for(var i = 0; i < 50000; i++) {
				a.push(4)
			}
		})
	})

	describe('create obj1024 x100', function() {
		var obj1024 = {}
		for (var ii = 0; ii < 1024; ii++) {
			obj1024['x' + ii] = ii
		}

		it('Cereb', function() {
			for(var i = 0; i < 100; i++) {
				new Cereb(obj1024)
			}
		})

		it('Immutable.fromJS', function() {
			for(var i = 0; i < 100; i++) {
				Immutable.fromJS(obj1024)
			}
		})
	})

	describe('create nested4^5 x50', function() {
		var val = 0
		
		function createNested(keys, levels) {
			if(levels == 0)
				return val++
			
			var nested = {}
			for (var ii = 0; ii < keys; ii++) {
				nested['x' + ii] = createNested(keys, levels-1)
			}
			return nested
		}

		it('Cereb', function() {
			for(var i = 0; i < 50; i++) {
				new Cereb(createNested(4, 5))
			}
		})

		it('Immutable.fromJS', function() {
			for(var i = 0; i < 50; i++) {
				Immutable.fromJS(createNested(4, 5))
			}
		})

		it('Object', function() {
			for(var i = 0; i < 50; i++) {
				createNested(4, 5)
			}
		})
	})



	describe('modify nested4^5 x50000', function() {
		var val = 0
		  , obj = createNested(4, 5)
		  , immutable = Immutable.fromJS(obj)
		  , cereb = new Cereb(immutable)
		  , cerebQ = new Cereb(immutable)
		
		function createNested(keys, levels) {
			if(levels == 0)
				return val++
			
			var nested = {}
			for (var ii = 0; ii < keys; ii++) {
				nested['x' + ii] = createNested(keys, levels-1)
			}
			return nested
		}

		it('Cereb', function(done) {
			cereb._manager.bind(function() {
				done()
			})

			for(var i = 0; i < 50000; i++) {
				cereb.x0.x0.x0.set(123)
			}
		})

		it('Cereb (queue only)', function() {
			for(var i = 0; i < 50000; i++) {
				cerebQ.x0.x0.x0.set(123)
			}
		})

		it('Immutable', function() {
			for(var i = 0; i < 50000; i++) {
				immutable.setIn(['x0', 'x0', 'x0'], 123)
			}
		})

		it('Object', function() {
			for(var i = 0; i < 50000; i++) {
				obj.x0.x0.x0 = 123
			}
		})
	})
})
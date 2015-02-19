var Cereb = require('./index')
  , Immutable = require('immutable')

describe('Cereb', function() {
	it('should return a reference', function() {
		var data = { a:1 }
		  , ref = new Cereb(data)

		ref.constructor.name.should.match(/Reference$/)
	})
	it('should return the correct type of reference or throw', function() {
		new Cereb({}).constructor.name.should.equal('MapReference')
		new Cereb([]).constructor.name.should.equal('ListReference')
		new Cereb(1).constructor.name.should.equal('NumberReference')
		new Cereb('').constructor.name.should.equal('StringReference')
		new Cereb(true).constructor.name.should.equal('BooleanReference')
	})
	it('should contain the data as an Immutable', function() {
		var data = { a:1 }
		  , ref = new Cereb(data)

		Immutable.is(ref.val(), new Immutable.Map(data)).should.be.true
	})
	it('should nest references', function() {
		var data = { a:{ b:{ c:1 , d:[1,2,3] } } }
		  , ref = new Cereb(data)

		ref.a.b.c.constructor.name.should.match(/Reference$/)
		ref.a.b.c.val().should.equal(1)
		ref.a.b.d[0].val().should.equal(1)
	})
	it('should be able to listen for changes', function(done) {
		var data = { a:1, b:2 }
		  , ref = new Cereb(data, function(updatedRef) {
		  	updatedRef.a.val().should.equal(0)
		  	done()
		  })

		ref.a.set(0)
	})
	it('should be reuse references', function(done) {
		var data = { a:1, b:2 }
		  , ref = new Cereb(data, function(updatedRef) {
		  	ref.b.should.equal(updatedRef.b)
		  	done()
		  })

		ref.a.set(0)
	})
	it('should leave the original reference untouched', function(done) {
		var data = { a:1, b:2 }
		  , ref = new Cereb(data, function(updatedRef) {
		  	ref.should.not.equal(updatedRef)
		  	ref.a.val().should.equal(1)
		  	done()
		  })

		ref.a.set(0)
	})
	it('should proxy Immutable update methods', function(done) {
		var data = { a:[1,2,3] }
		  , ref = new Cereb(data, function(updatedRef) {
		  	updatedRef.a[0].val().should.equal(0)
		  	done()
		  })

		ref.a.unshift(0)
	})
	it('should allow chaining methods', function(done) {
		var data = { a:[1,2,3] }
		  , ref = new Cereb(data, function(updatedRef) {
		  	updatedRef.a[0].val().should.equal(0)
		  	updatedRef.a[4].val().should.equal(4)
		  	done()
		  })

		ref.a.unshift(0).push(4)
	})
	it('should batch updates', function(done) {
		var data = { a:[1,2,3] }
		  , ref = new Cereb(data, function(updatedRef) {
		  	updatedRef.a[0].val().should.equal(0)
		  	updatedRef.a[4].val().should.equal(9)
		  	done()
		  })

		ref.a.unshift(0)
		setImmediate(function() {
			ref.a.push(9)
			ref.a.val().size.should.equal(3) //changes have not been made yet
		})
	})
	it('should throw if you try to update an out-of-date reference???', function(done) {
		var data = { a:[1,2,3] }
		  , ref = new Cereb(data, function(updatedRef) {
		  	(function() {
		  		ref.a.unshift(5)
		  	}).should.throw(/out of date/)
		  	done()
		  })

		ref.a.unshift(0)
	})
})


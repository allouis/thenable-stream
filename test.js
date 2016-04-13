var test = require('tape')
var fs = require('fs')
var path = require('path')
var os = require('os')

var thenable = require('./')

test('it exports a function', function (assert) {
  assert.plan(1)

  var actual = typeof thenable
  var expected = 'function'

  assert.equals(actual, expected,
    'typeof exports is "function"')
})

test('it returns the stream passed', function (assert) {
  assert.plan(1)

  var stream = fs.createReadStream(path.join(__dirname, '/package.json'))
  var thenable_stream = thenable(stream)

  var expected = stream
  var actual = thenable_stream

  assert.equals(actual, expected,
    'it returns the original stream passed')
})

test('the returned stream has a "then" method', function (assert) {
  assert.plan(1)

  var stream = fs.createReadStream(path.join(__dirname, '/package.json'))
  var thenable_stream = thenable(stream)

  var actual = typeof thenable_stream.then
  var expected = 'function'

  assert.equals(actual, expected,
    'thenable_stream.then is a function')
})

test('the "then" method returns an instance of Promise', function (assert) {
  assert.plan(1)

  var stream = fs.createReadStream(path.join(__dirname, '/package.json'))
  var thenable_stream = thenable(stream)

  var actual = thenable_stream.then().constructor
  var expected = Promise

  assert.equals(actual, expected,
    '"then" returns a Promise')
})

test('the "then" method rejects the promise if the stream has already been piped', function (assert) {
  assert.plan(1)

  var stream = fs.createReadStream(path.join(__dirname, '/package.json'))
  var thenable_stream = thenable(stream)

  var sink = fs.createWriteStream(path.join(os.tmpdir(), 'thenable-stream-test.tmp'))

  thenable_stream.pipe(sink)

  thenable_stream.then(null, function fail () {
    assert.pass('then should not resolve after pipe has been called')
  })
})

test('the "then" method rejects if the stream errors', function (assert) {
  assert.plan(1)

  var stream = fs.createReadStream(path.join(__dirname, '/package.json'))
  var thenable_stream = thenable(stream)

  thenable_stream.then(null, function fail () {
    assert.pass('then should not resolve after pipe has been called')
  })

  thenable_stream.emit('error', new Error('some error'))
})

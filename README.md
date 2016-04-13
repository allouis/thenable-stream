# thenable-stream

turns a stream into a thenable (Promise, p. much)

### usage

This will usually be used for exposing API's and allowing different ways to consume the data.

```javascript
var fs = require('fs')
var thenable = require('thenable-stream')

var stream = thenable(fs.createReadStream('meme.gif'))

stream.then(function (buffer) {
  console.log('length:', buffer.length)
}, function (error) {
  console.log('error:', error)
})

// OR

stream.pipe(process.stdout)
```

### API

#### `thenable_stream = thenable(stream)`

Augments the stream with an extra `then` method.

Returns the original stream.

#### `thenable_stream.then([success, fail])`

**Warning**: You cannot call `then` after you have piped the stream, as the data will have started flowing already and you will not be able to get the entire contents of the stream.

Works like traitional Promise then method.

`success` is called with the entire contents of the stream.

`fail` is called with an error emitted from the stream.

Returns a Promise

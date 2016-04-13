var concat = require('concat-stream')

module.exports = thenable

function thenable (stream) {
  stream.then = then
  function then (success, fail) {
    if (!fail) fail = Promise.reject.bind(Promise)
    if (!success) success = Promise.resolve.bind(Promise)
    if (this._readableState.pipesCount) return Promise.resolve(fail(new Error('Cannot call "then" after stream has been piped')))
    return new Promise(function (resolve) {
      stream.on('error', function (error) {
        resolve(fail(error))
      })
      stream.pipe(concat(function (result) {
        resolve(success(result))
      }))
    })
  }
  return stream
}

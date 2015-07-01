var path = require('path')
  , fs = require('fs')

module.exports = function(file, stream) {
  stream = stream || process.stdout
  file = file
    ? file
    : module.parent && module.parent.filename
    ? path.resolve(path.dirname(module.parent.filename), 'usage.txt')
    : path.resolve('usage.txt')

  return function(code) {
    var rs = fs.createReadStream(file)
    rs.pipe(stream)
    rs.on('close', function() {
      if (code) process.exit(code)
    })
  }
}

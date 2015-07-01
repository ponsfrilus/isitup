# help

[substack](https://github.com/substack) way of --help

## Install

```bash
$ npm install help
```

## Usage

```js
var help = require('help')('usage.txt')

if (/* someone requested help */) {
  return help(0)
}
```

## API

help(filepath, stream)

returns function(code)

Pipes the contents of <filepath> to `process.stdout`.

`code` is the exit code. If not falsy, then the process is explictly exited.

`stream` defaults to `process.stdout`

## Full example

```js
var help = require('help')('usage.txt')
var args = process.argv.splice(2)
if (args[0] === '-h' || args[0] === '--help' || args[0] === 'help') {
  // process prints contents of `usage.txt` and returns
  return help()
}

// the first arg must be a number
if (isNaN(args[0])) {
  // process prints contents of `usage.txt` and exits with code 1
  return help(1)
}
```

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)

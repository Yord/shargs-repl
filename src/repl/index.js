const {Async} = require('./Async')
const nodeRepl = require('repl')
const {replEvalF} = require('./replEval')
const {completer} = require('./completer')
const {Sync} = require('./Sync')

const replF = mode => (
  lexer,
  parser,
  commands,
  {
    only = false,
    defaultAction = (value, errs) => {},
    prompt = undefined,
    eval: replEval = undefined,
    completer: _completer = undefined
  } = {
    only: false,
    defaultAction: (value, errs) => {},
  }
) => {
  console.log(commands.desc ? commands.desc + '\n' : '')

  nodeRepl.start({
    ignoreUndefined: true,
    prompt:    typeof prompt     === 'string'   ? prompt     : `${commands.key}~$ `,
    eval:      typeof replEval   === 'function' ? replEval   : replEvalF(mode)(parser, commands, defaultAction),
    completer: typeof _completer === 'function' ? _completer : completer(lexer, commands, {only})
  })
}

module.exports = {
  repl: replF(Async),
  replF,
  replSync: replF(Sync)
}
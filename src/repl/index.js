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
    defaultAction = (value, errs) => {}
  } = {
    only: false,
    defaultAction : (value, errs) => {}
  }
) => {
  console.log(commands.desc ? commands.desc + '\n' : '')

  nodeRepl.start({
    prompt: `${commands.key}~$ `,
    ignoreUndefined: true,
    eval: replEvalF(mode)(parser, commands, defaultAction),
    completer: completer(lexer, commands, {only})
  })
}

module.exports = {
  repl: replF(Async),
  replF,
  replSync: replF(Sync)
}
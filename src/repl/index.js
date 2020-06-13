const nodeRepl = require('repl')
const {replEval} = require('./replEval')
const {completer} = require('./completer')

const repl = (parser, commands) => {
  console.log(commands.desc ? commands.desc + '\n' : '')

  nodeRepl.start({
    prompt: `${commands.key}~$ `,
    ignoreUndefined: true,
    completer: completer(parser, commands)
    eval: replEval(parser, commands),
  })
}

module.exports = {
  repl
}
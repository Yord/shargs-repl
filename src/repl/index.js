const nodeRepl = require('repl')
const {replEval} = require('./replEval')
const {completer} = require('./completer')

const repl = (lexer, parser, commands, {only = false} = {only: false}) => {
  console.log(commands.desc ? commands.desc + '\n' : '')

  nodeRepl.start({
    prompt: `${commands.key}~$ `,
    ignoreUndefined: true,
    eval: replEval(parser, commands),
    completer: completer(lexer, commands, {only})
  })
}

module.exports = {
  repl
}
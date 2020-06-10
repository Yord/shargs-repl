const nodeRepl = require('repl')
const {eval} = require('./eval')
const {completer} = require('./completer')

const repl = (parser, commands) => {
  console.log(commands.desc ? commands.desc + '\n' : '')

  nodeRepl.start({
    prompt: `${commands.key}~$ `,
    ignoreUndefined: true,
    eval: eval(parser, commands),
    completer: completer(parser, commands)
  })
}

module.exports = {
  repl
}
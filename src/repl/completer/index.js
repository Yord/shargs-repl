const {flatMap} = require('./flatMap')

const completer = (lexer, cmd, {only = false} = {only: false}) => {
  const lex = lexer(cmd)

  return line => {
    const {opts} = lex(line)

    const values = justValues(opts)

    return [[], line]
  }
}

module.exports = {
  completer
}

function justValues (opts) {
  return flatMap(opts, opt => {
    if (Array.isArray(opt.values)) {
      if (isSubcommand(opt)) {
        return [{...opt, values: justValues(opt.values)}]
      } else {
        return [opt]
      }
    } else {
      return []
    }
  })
}

function isSubcommand ({opts} = {opts: undefined}) {
  return Array.isArray(opts)
}
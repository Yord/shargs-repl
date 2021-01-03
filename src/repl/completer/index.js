const {flatMap}    = require('./flatMap')
const {getMatches} = require('./getMatches')

const completer = (lexer, cmd, {only = false} = {only: false}) => {
  const lex = lexer(cmd)

  return line => {
    const {opts} = lex(line)

    return getMatches(line, opts, cmd, {only})
  }
}

module.exports = {
  completer
}
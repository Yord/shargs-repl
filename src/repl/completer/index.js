import {getMatches} from './getMatches'
import {flatMap} from './flatMap'

const completer = (parser, commands) => {
  const parse = parser(commands)

  return line => {
    if (line === '') {
      const args = flatMap(commands.opts, cmd => cmd.args)
      return [args, '']
    }

    const {args} = parse(line)

    const {_, ...subcommands} = args

    let matches = getMatches(commands.opts, subcommands, _)

    if (line[line.length - 1] !== ' ' && matches.length === 1) {
      matches = matches.map(m => ' ' + m)
    }

    return [matches, '']
  }
}

module.exports = {
  completer
}
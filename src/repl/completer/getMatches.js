import {flatMap} from './flatMap'

function getMatches (opts, subcommands, rest) {
  return flatMap(Object.entries(subcommands), ([key, value]) => {
    const opts2 = opts.filter(_ => _.key === key)
    const args  = flatMap(opts2, cmd => flatMap(cmd.opts || [], _ => _.args || [`<${_.key}>`]))
    const only  = flatMap(opts2, cmd => flatMap(cmd.opts || [], _ => _.only || []))

    if (Array.isArray(value._)) {
      if (rest.length === 0) {
        return args
      } else {
        const partialArg = rest[0]

        if (args.includes(partialArg)) return only

        const started = args.filter(arg => arg.startsWith(partialArg))
        if (started.length > 0) return started
        else return []
      }
    } else {
      return getMatches(flatMap(opts2, opt => opt.opts), value, rest)
    }
  })
}

module.exports = {
  getMatches
}
const {UnknownCommand} = require('./errors')
const {pipe}           = require('./pipe')

const replEvalF = mode => (parser, commands, defaultAction) => {
  const parse = parser(commands)

  return (cmd, context, filename, callback) => {
    const {errs, args} = parse(cmd)

    const _ = args._ || []

    if (_.length > 0) {
      _.map(cmd =>
        errs.push(UnknownCommand({cmd}))
      )
    }

    const entries = Object.entries(args).filter(([key]) => key !== '_')

    if (entries.length === 0) {
      defaultAction({cmd}, errs)
    }

    const results = entries.map(([key, value]) => {
      const cmd = commands.opts.find(_ => _.args.includes(key)) || { action: defaultAction }
      const action = cmd.action || defaultAction

      if (typeof action === 'undefined') {
        return mode.resolve()
      } else {
        return mode.resolve(action(value, errs))
      }
    })

    return pipe(
      mode.all,
      mode.then(() => callback(null, undefined)),
      mode.catch(err => callback(null, err === null ? undefined : err))
    )(results)
  }
}

module.exports = {
  replEvalF
}
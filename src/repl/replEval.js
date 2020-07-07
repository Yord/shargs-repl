const {pipe} = require('./pipe')

const replEvalF = mode => (parser, commands, defaultAction) => {
  const parse = parser(commands)

  return (cmd, context, filename, callback) => {
    const {errs, args} = parse(cmd)

    const results = Object.entries(args).map(([key, value]) => {
      const cmd = commands.opts.find(_ => _.args.includes(key)) || { action: defaultAction }
      const action = cmd.action || defaultAction

      return typeof action === 'undefined' ? mode.resolve() : mode.resolve(action(value, errs))
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
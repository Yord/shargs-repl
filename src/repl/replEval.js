const {pipe} = require('./pipe')

const replEvalF = mode => (parser, commands) => {
  const parse = parser(commands)

  return (cmd, context, filename, callback) => {
    const {errs, args} = parse(cmd)

    const results = Object.entries(args).map(([key, value]) => {
      const cmd = commands.opts.find(_ => _.args.includes(key)) || { action: _ => 42 }
      const action = cmd.action || (_ => 42)

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
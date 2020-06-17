const replEval = (parser, commands) => {
  const parse = parser(commands)

  return (cmd, context, filename, callback) => {
    const { errs, args } = parse(cmd)

    Object.entries(args).forEach(([key, value]) => {
      const cmd = commands.opts.find(_ => _.args.includes(key)) || { action: _ => undefined }
      const action = cmd.action || (_ => undefined)

      action(value, errs)
    })

    callback(null, undefined);
  }
}

module.exports = {
  replEval
}
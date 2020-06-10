const eval = (parser, commands) => {
  const parse = parser(commands)

  return (cmd, context, filename, callback) => {
    const {errs, args} = parse(cmd)

    const strings = Object.entries(args).map(([key, value]) => {
      const cmd = commands.opts.find(_ => _.args.includes(key)) || {action: _ => ''}
      const action = cmd.action || (_ => '')
      return action(value)
    })
    
    const output = (
      errs.length > 0 ? errs.map(({code, msg}) => `${code}: ${msg}`).join('\n')
                      : strings.join('\n')
    )
  
    console.log(output)
  
    callback(null, undefined);
  }
}

module.exports = {
  eval
}
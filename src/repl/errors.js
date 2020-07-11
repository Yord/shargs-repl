const UnknownCommand = ({cmd}) => ({
  code: 'UnknownCommand',
  msg:  'The provided command is not a REPL command.',
  info: {cmd}
})

module.exports = {
  UnknownCommand
}
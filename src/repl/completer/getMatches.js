const {flatMap} = require('./flatMap')

function getMatches (line, values, cmd, {only}) {
    // 1. If line is empty, return all args and pos arg of command
    if (line === '') {
      const matches = summarize(cmd)
      return match(matches, line)
    }
  
    const cmdStack = getCmdStack(cmd, values)
    const rest     = getRest(values)

    // 2. If last value is command and not rest, show args of last command
    if (rest === null) {
      const cmd2 = cmdStack[cmdStack.length - 1]
      const matches = summarize(cmd2)
      return match(matches, line)
    }
  
    // 3. If rest is -- display all command options
    if (rest === '--') {
      const matches = summarize(cmd)
      return match(matches, line)
    }
  
    let matches = []
  
    // 4. Check if rest is args in any of the stack commands (from right to left)
    //    -> if args of subcommand, show all its opts
    //    -> if args is option, show its only field or empty if missing
    for (let i = cmdStack.length - 1; i >= 0; i--) {
      const cmd2 = cmdStack[i]
  
      const optsWithRestArg = flatMap(
        cmd2.opts,
        opt => (opt.args || []).includes(rest) ? [opt] : []
      )
  
      if (optsWithRestArg.length > 0) {
        matches = flatMap(optsWithRestArg, opt => {
          if (isSubcommand(opt)) return summarize(opt)
          else {
            if (opt.descArg) return [opt.descArg]
            if (only === true && opt.only) return opt.only
            if (opt.types) return [`${(opt.types || []).map(type => '<' + type + '>').join(' ')}`]
            return []
          }
        })
  
        break
      }
    }
  
    if (matches.length > 0) return match(matches, line)
  
    // 5. If not, check if rest is start of args in any of the stack commands (from right to left)
    //    -> if yes, matches are all right-most args that start with rest
    for (let i = cmdStack.length - 1; i >= 0; i--) {
      const cmd2 = cmdStack[i]
  
      const argsStartingWithRest = flatMap(
        cmd2.opts,
        opt => flatMap(opt.args || [], arg => arg.startsWith(rest) ? [arg] : [])
      )
  
      if (argsStartingWithRest.length > 0) {
        matches = argsStartingWithRest
  
        break
      }
    }
  
    if (matches.length > 0) return complete(matches, line, rest)
  
    // 6. If not, 
    //    -> Matches are first non-required pos arg of rightmost command without values, or any subcommand of any of the stack commands 
    for (let i = cmdStack.length - 1; i >= 0; i--) {
      const cmd2 = cmdStack[i]
      const args = summarize(cmd2)
      matches = [...matches, ...args]
    }
  
    return match(matches, line)
  }
  
  module.exports = {
    getMatches
  }
  
  function match (matches, line) {
    if (matches.length === 1) return [[line + ' ' + matches[0]], line]
    return [matches, line]
  }
  
  function complete (matches, line, rest) {
    if (matches.length === 1) return [[line.slice(0, line.length - rest.length) + matches[0]], line]
    return [matches, line]
  }
  
  function getCmdStack (cmd, values) {
    let stack = [cmd]
  
    for (let i = values.length - 1; i >= 0; i--) {
      const opt = values[i]
  
      if (isSubcommand(opt)) {
        const stack2 = getCmdStack(opt, opt.values)
        stack = [...stack, ...stack2]
        break
      }
    }
  
    return stack
  }
  
  function isSubcommand ({opts} = {opts: undefined}) {
    return Array.isArray(opts)
  }
  
  function getRest (values) {
    if (values.length === 0) return null
  
    const opt = values[values.length - 1]
  
    switch (true) {
      case isSubcommand(opt): return getRest(opt.values || [])
      case isRest(opt):       return opt.values[0]
      default:                return null
    }
  }
  
  function isRest (opt) {
    return Object.keys(opt).length === 1 && Array.isArray(opt.values) && opt.values.length === 1
  }
  
  function summarize (cmd) {
    return flatMap(cmd.opts || [], opt => opt.args ? opt.args : argName(opt))
  }

  function argName ({key, types, only, descArg}) {
    if (typeof descArg === 'string') return [descArg]
    if (Array.isArray(only)) return only
    if (Array.isArray(types) && types.length > 0) return [types.map(type => `<${type}>`).join(' ')]
    return [`<${key}>`]
  }
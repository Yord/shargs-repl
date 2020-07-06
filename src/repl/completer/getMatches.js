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

    // 3. If line ends with "-- " display all command options
    if (line.endsWith('-- ')) {
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

    // 5. Check if rest is start of args in any of the stack commands (from right to left)
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

    // 6. Check if the first positional argument has only values and the rest fits some values from only
    if (only === true) {
      const cmd = cmdStack[cmdStack.length - 1]
      const firstPosArg = cmd.opts.find(isPosArg)

      if (typeof firstPosArg !== 'undefined' && Array.isArray(firstPosArg.only)) {
        matches = firstPosArg.only.filter(value => value.startsWith(rest))
      }
    }

    if (matches.length > 0) return complete(matches, line, rest)

    // 7. Otherwise
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
    if (matches.length === 1) {
      return [
        [line.slice(0, line.length - rest.length) + matches[0]],
        line
      ]
    }

    const substr = shortestCommonSubstring(matches)

    if (rest !== substr) {
      return [
        [line.slice(0, line.length - rest.length) + substr],
        line
      ]
    }

    return [
      matches,
      line.slice(0, line.length - rest.length) + substr
    ]
  }

  function shortestCommonSubstring (matches) {
    if (matches.length === 0) return ''

    let shortest = matches[0]
    for (let i = 1; i < matches.length; i++) {
      const match = matches[i]
      
      if (match.length < shortest.length) {
        shortest = match
      }
    }

    let substr = ''

    shortestLoop: for (let i = 0; i < shortest.length; i++) {
      const ch = shortest[i]

      for (let j = 0; j < matches.length; j++) {
        const match = matches[j]
        const ch2 = match[i]

        if (ch !== ch2) break shortestLoop
      }

      substr += ch
    }

    return substr
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
      case isPosArg(opt):     return opt.values[0]
      case isRest(opt):       return opt.values[0]
      default:                return null
    }
  }

  function isPosArg ({args}) {
    return !Array.isArray(args)
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
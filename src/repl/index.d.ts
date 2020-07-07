export interface Err {
  code: string
  msg:  string
  info: object
}

export interface Opt {
  args?: string[]
  contradicts?: string[],
  defaultValues?: any
  desc?: string
  descArg?: string
  implies?: string[]
  key?: string
  only?: any[]
  opts?: Opt[]
  required?: boolean
  reverse?: boolean
  rules?: (opt?: Opt) => (opts?: Opt[]) => boolean
  types?: string[]
  values?: any[]
  [key: string]: any
}

export interface Options {
  only?: boolean
  defaultAction?: (value: any, errs: Err[]) => void
  prompt?: string
  eval?: (cmd: any, context: any, filename: any, callback: any) => any,
  completer?: (line: string) => [string[], string]
}

export const repl: (
  lexer:  (opt?: Opt) => (any?: A) => {errs: Err[], opts: Opt[]},
  parser: (opt?: Opt) => (any?: A) => {errs: Err[], args: B},
  commands: Opt,
  options: Options
) => void
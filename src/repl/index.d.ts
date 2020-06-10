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

export const repl: (parser: (opt?: Opt) => (any?: A) => {errs: Err[], any: B}, commands: Opt) => void
import {Err, Opt} from '../../index'

export const completer: <A, B>(lexer: (opt?: Opt) => (any?: A) => {errs: Err[], opts: B}, commands: Opt, opts?: {only?: boolean}) =>
                              (line: string) =>
                              string[]
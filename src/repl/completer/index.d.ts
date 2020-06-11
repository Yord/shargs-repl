import {Err, Opt} from '../../index'

export const completer: <A, B>(parser: (opt?: Opt) => (any?: A) => {errs: Err[], any: B}, commands: Opt) =>
                              (line: string) =>
                              string[]
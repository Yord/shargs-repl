const {getMatches} = require('./getMatches')

test('getMatches ', () => {
  const opts = [
    {key: 'a', args: ['-a'], types: ['1']}
  ]

  const subcommands = 

  const rest = null

  const res = getMatches(opts, subcommands, rest)

  const exp = ['foo', 'bar', 'baz']

  expect(res).toStrictEqual(exp)
})
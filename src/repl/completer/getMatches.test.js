const {getMatches} = require('./getMatches')

const jet = {key: 'jet', args: ['--jet'], types: ['6']}

const lot = {key: 'lot', args: ['--lot'], types: []}

const mad = {key: 'mad', args: ['--mad'], types: ['9', '10'], only: ['AAA', 'AAB']}

const Cat = {key: 'Cat', args: ['Cat'], opts: [
  jet,
  {key: 'kit', args: ['--kit'], types: ['7', '8']},
  lot,
  mad,
  {key: 'nut', args: ['--nut'], types: ['9', '10'], only: ['C']},
  {key: 'oak', types: ['11'], only: ['OAK']}
]}

const Put = {key: 'Put', args: ['Put'], opts: [
  {key: 'quo', args: ['--quo']},
  {key: 'rat', args: ['--rat']}
]}

const cmd = {key: 'Arc', opts: [
  {key: 'Bat', args: ['Bat'], opts: []},
  Cat,
  {key: 'dot', args: ['-d', '--dot'], types: ['1']},
  {key: 'eat', args: ['-e', '--eat'], types: ['1', '2']},
  {key: 'fat', args: ['--fat'], types: []},
  {key: 'gut', types: ['3'], only: ['GUT']},
  {key: 'hat', types: ['4', '5']},
  {key: 'ink', descArg: 'INK'},
  Put
]}

test('getMatches returns all cmd args and pos args on unknown input', () => {
  const line = ''

  const values = []

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', 'Put', 'GUT'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns all cmd args and pos args on unknown input', () => {
  const line = 'cvbnkl'

  const values = [
    {values: ['cvbnkl']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', 'Put', 'GUT'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns full options args on partial input for subcommands', () => {
  const line = 'Ba'

  const values = [
    {values: ['Ba']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for primitive options', () => {
  const line = '--do'

  const values = [
    {values: ['--do']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['--dot'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for primitive arrays', () => {
  const line = '--ea'

  const values = [
    {values: ['--ea']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['--eat'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for flag options', () => {
  const line = '--f'

  const values = [
    {values: ['--f']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['--fat'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for primitive options in subcommands', () => {
  const line = 'Cat --je'

  const values = [
    {...Cat, values: [
      {values: ['--je']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat --jet'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for primitive arrays in subcommands', () => {
  const line = 'Cat --ki'

  const values = [
    {...Cat, values: [
      {values: ['--ki']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat --kit'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for flag options in subcommands', () => {
  const line = 'Cat --lo'

  const values = [
    {...Cat, values: [
      {values: ['--lo']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat --lot'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input with shortest common substring', () => {
  const line = 'Put -'

  const values = [
    {...Put, values: [
      {values: ['-']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Put --'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches completes full options args on partial input for primitive positional arguments in subcommands', () => {
  const line = 'Cat OA'

  const values = [
    {...Cat, values: [
      {values: ['OA']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat OAK'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches uses only to suggest possible value of array option in subcommands', () => {
  const line = 'Cat --mad'

  const values = [
    {...Cat, values: [
      {values: ['--mad']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['AAA', 'AAB'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches uses only values to suggest possible value of array option in subcommands 1', () => {
  const line = 'Cat --mad A'

  const values = [
    {...Cat, values: [
      {...mad, values: ['A']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat --mad AA'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches uses only values to suggest possible value of array option in subcommands 2', () => {
  const line = 'Cat --mad AA'

  const values = [
    {...Cat, values: [
      {...mad, values: ['AA']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['AAA', 'AAB'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches uses only to complete value of array option in subcommands', () => {
  const line = 'Cat --nut'

  const values = [
    {...Cat, values: [
      {values: ['--nut']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Cat --nut C'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns all cmd args and pos args on "-- "', () => {
  const line = 'Cat --jet A --lot -- '

  const values = [
    {...Cat, values: [
      {...jet, values: ['A']},
      {...lot, values: [1]},
      {values: ['--']}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', 'Put', 'GUT'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns all subcommand args and pos args with no rest', () => {
  const line = 'Cat --jet A --lot'

  const values = [
    {...Cat, values: [
      {...jet, values: ['A']},
      {...lot, values: [1]}
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['--jet', '--kit', '--lot', '--mad', '--nut', 'OAK'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns only first positional argument if the line is empty', () => {
  const posA = {key: 'posA', types: ['string'], only: ['foo', 'bar']}
  const posB = {key: 'posB', types: ['string'], only: ['baz', 'bat']}
  const posC = {key: 'posC', types: ['string'], only: ['bam', 'ban']}

  const cmd = {
    key: 'posArgs',
    opts: [posA, posB, posC]
  }

  const line = ''

  const values = [
    posA,
    posB,
    posC
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['foo', 'bar'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns only first positional argument if the line is empty in a subcommand', () => {
  const posA = {key: 'posA', types: ['string'], only: ['foo', 'bar']}
  const posB = {key: 'posB', types: ['string'], only: ['baz', 'bat']}
  const posC = {key: 'posC', types: ['string'], only: ['bam', 'ban']}

  const sub = {
    key: 'sub',
    args: ['sub'],
    opts: [posA, posB, posC]
  }

  const cmd = {
    key: 'posArgs',
    opts: [sub]
  }

  const line = 'sub'

  const values = [
    {...sub, values: [
      posA,
      posB,
      posC
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['foo', 'bar'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns only the second positional argument if the first is already present', () => {
  const posA = {key: 'posA', types: ['string'], only: ['foo', 'bar']}
  const posB = {key: 'posB', types: ['string'], only: ['baz', 'bat']}
  const posC = {key: 'posC', types: ['string'], only: ['bam', 'ban']}

  const sub = {
    key: 'sub',
    args: ['sub'],
    opts: [posA, posB, posC]
  }

  const cmd = {
    key: 'posArgs',
    opts: [sub]
  }

  const line = 'sub foo'

  const values = [
    {...sub, values: [
      {...posA, values: ['foo']},
      posB,
      posC
    ]}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['baz', 'bat'], line]

  expect(res).toStrictEqual(exp)
})
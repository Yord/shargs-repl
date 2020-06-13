const {getMatches} = require('./getMatches')

const jet = {key: 'jet', args: ['--jet'], types: ['6']}

const lot = {key: 'lot', args: ['--lot'], types: []}

const Cat = {key: 'Cat', args: ['Cat'], opts: [
  jet,
  {key: 'kit', args: ['--kit'], types: ['7', '8']},
  lot,
  {key: 'mad', args: ['--mad'], types: ['9', '10'], only: ['A', 'B']},
  {key: 'nut', args: ['--nut'], types: ['9', '10'], only: ['C']}
]}

const cmd = {key: 'Arc', opts: [
  {key: 'Bat', args: ['Bat'], opts: []},
  Cat,
  {key: 'dot', args: ['-d', '--dot'], types: ['1']},
  {key: 'eat', args: ['-e', '--eat'], types: ['1', '2']},
  {key: 'fat', args: ['--fat'], types: []},
  {key: 'gut', types: ['3']},
  {key: 'hat', types: ['4', '5']},
  {key: 'ink', descArg: 'INK'}
]}

test('getMatches returns all cmd args and pos args on unknown input', () => {
  const line = ''

  const values = []

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', '<3>', '<4> <5>', 'INK'], line]

  expect(res).toStrictEqual(exp)
})

test('getMatches returns all cmd args and pos args on unknown input', () => {
  const line = 'cvbnkl'

  const values = [
    {values: ['cvbnkl']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', '<3>', '<4> <5>', 'INK'], line]

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

test('getMatches completes full options args on partial input for subcommands', () => {
  const line = 'Ba'

  const values = [
    {values: ['Ba']}
  ]

  const res = getMatches(line, values, cmd, {only: true})

  const exp = [['Bat'], line]

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

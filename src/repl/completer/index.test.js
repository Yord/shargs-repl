const {completer} = require('.')

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

test('completer returns all cmd args and first pos arg for empty line', () => {
  const line = ''

  const lexer = () => () => ({
    errs: [],
    opts: []
  })

  const res = completer(lexer, cmd, {only: true})(line)

  const exp = [['Bat', 'Cat', '-d', '--dot', '-e', '--eat', '--fat', '<3>'], line]

  expect(res).toStrictEqual(exp)
})
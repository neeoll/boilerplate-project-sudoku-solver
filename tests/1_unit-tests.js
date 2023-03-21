const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid string of 81 characters', function() {
    const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const expected = true
    assert.strictEqual(input.length == 81, expected)
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    const input = "AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const expected = false
    assert.strictEqual(solver.validate(input), expected)
  })

  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6."
    const expected = false
    assert.strictEqual(input.length == 81, expected)
  })

  test('Logic handles a valid row placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '7'
    const expected = true

    assert.strictEqual(solver.checkRowPlacement(puzzle, row, column, value), expected)
  })

  test('Logic handles an invalid row placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '1'
    const expected = false

    assert.strictEqual(solver.checkRowPlacement(puzzle, row, column, value), expected)
  })

  test('Logic handles a valid column placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '7'
    const expected = true

    assert.strictEqual(solver.checkColPlacement(puzzle, row, column, value), expected)
  })

  test('Logic handles an invalid column placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '1'
    const expected = false

    assert.strictEqual(solver.checkColPlacement(puzzle, row, column, value), expected)
  })

  test('Logic handles a valid region (3x3 grid) placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '7'
    const expected = true

    assert.strictEqual(solver.checkRegionPlacement(puzzle, row, column, value), expected)
  })

  test('Logic handles an invalid region (3x3 grid) placement', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const row = 'A'
    const column = '1'
    const value = '9'
    const expected = false

    assert.strictEqual(solver.checkRegionPlacement(puzzle, row, column, value), expected)
  })

  test('Valid puzzle strings pass the solver', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'

    assert.strictEqual(solver.solve(puzzle), expected)
  })

  test('Invalid puzzle strings fail the solver', function() {
    const puzzle = "9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6"
    const expected = false

    assert.strictEqual(solver.solve(puzzle), expected)
  })

  test('Solver returns the expected string for an incomplete puzzle', function() {
    const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    const expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'

    assert.strictEqual(solver.solve(puzzle), expected)
  })
});

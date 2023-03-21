'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body
      
      if (!puzzle || !coordinate || !value) { 
        return res.json({ error: 'Required field(s) missing' })
      }
      if (puzzle.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      if (solver.validate(puzzle) == false) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      
      const rowCoord = coordinate[0].toUpperCase().charCodeAt(0) - 64
      const colCoord = coordinate[1]
      if (coordinate.length != 2 || rowCoord < 1 || rowCoord > 9 || colCoord < 1 || colCoord > 9) {
        return res.json({ error: 'Invalid coordinate' })
      }
      if (value < 1 || value > 9 || isNaN(value)) {
        return res.json({ error: 'Invalid value' })
      }
      
      Promise.all([
        solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value), solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value), solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)
      ]).then(results => {
        if (!results[0] || !results[1] || !results[2]) { 
          const conflicts = []
          if (!results[0]) { conflicts.push("row") }
          if (!results[1]) { conflicts.push("column") }
          if (!results[2]) { conflicts.push("region") }
          res.json({ valid: false, conflict: conflicts })
        } else {
          res.json({ valid: true })
        }
      }).catch(err => {
        console.error(err)
        res.json({ valid: false, conflict: ["unknown"]})
      })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body
      if (!puzzle) { 
        return res.json({ error: 'Required field missing' })
      }
      if (puzzle.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      if (solver.validate(puzzle) == false) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      let solution = solver.solve(puzzle)

      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved'})
      } else {
        return res.json({ solution: solution })
      }
    });
};

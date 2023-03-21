class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[0-9.]+$/
    return regex.test(puzzleString)
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const substrings = [];
    for (let i = 0; i < puzzleString.length; i += 9) {
      substrings.push(puzzleString.substring(i, i + 9));
    }

    const rowIndex = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8 }
    const rowString = substrings[rowIndex[row.toUpperCase()]]

    if (rowString.includes(value)) { 
      if (rowString[column - 1] == value) {
        return true
      } else {
        return false 
      }
    } else {
      return true
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    const substrings = [];
    for (let i = 0; i < 9; i++) {
      let substring = '';
      for (let j = i; j < puzzleString.length; j += 9) {
        substring += puzzleString[j];
      }
      substrings.push(substring);
    }

    const columnString = substrings[column - 1]
    const rowIndex = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8 }
    
    if (columnString.includes(value)) { 
      if (columnString[rowIndex[row.toUpperCase()]] == value) {
        console.log(columnString[rowIndex[row.toUpperCase()]])
        return true
      } else {
        return false 
      }
    } else {
      return true
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const _row = row.charCodeAt(0) - 65;
    const _col = parseInt(column) - 1;
    const regionStartRow = Math.floor(_row / 3) * 3;
    const regionStartCol = Math.floor(_col / 3) * 3;
    let region = '';
    for (let i = regionStartRow; i < regionStartRow + 3; i++) {
      for (let j = regionStartCol; j < regionStartCol + 3; j++) {
        region += puzzleString.charAt(i * 9 + j);
      }
    }
    const _value = puzzleString.charAt(_row * 9 + _col);

    if (region.includes(value)) {
      if (value == _value) {
        return true
      } else {
      return false
      }
    } else {
      return true
    }
  }

  solve(puzzleString) {
    let board = [];
    let k = 0;
    for (let i = 0; i < 9; i++) {
      let row = [];
      for (let j = 0; j < 9; j++) {
        let val = puzzleString[k];
        k++;
        if (val === '.') {
          row.push(0);
        } else {
          row.push(parseInt(val));
        }
      }
      board.push(row);
    }
  
    function solve() {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              let isValid = true;
              // Check row and column
              for (let i = 0; i < 9; i++) {
                if (board[row][i] === num || board[i][col] === num) {
                  isValid = false;
                  break;
                }
              }
              if (!isValid) {
                continue;
              }
  
              // Check subgrid
              let subRow = Math.floor(row / 3) * 3;
              let subCol = Math.floor(col / 3) * 3;
              for (let i = subRow; i < subRow + 3; i++) {
                for (let j = subCol; j < subCol + 3; j++) {
                  if (board[i][j] === num) {
                    isValid = false;
                    break;
                  }
                }
                if (!isValid) {
                  break;
                }
              }
              if (!isValid) {
                continue;
              }
  
              // If num is valid, fill the cell and recursively continue to solve the board
              board[row][col] = num;
              if (solve()) {
                return true;
              } else {
                // Backtrack
                board[row][col] = 0;
              }
            }
            // If we have tried all numbers and none worked, return false
            return false;
          }
        }
      }
      // If we have filled all cells, return true
      return true;
    }
  
    if (solve()) {
      let output = "";
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          output += board[i][j].toString();
        }
      }
      return output;
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;


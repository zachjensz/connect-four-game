export function createGrid(game_config) {
  const board = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0));
  return board
}

const findWinner = (board) => {
  let winner = 0;

  const getColumn = (column) => {
    const result = [];
    for (let i = 0; i < board.length; i++) {
      result.push(board[i][column]);
    }
    return result;
  };

  const getDiangle = () => {
    const iLength = board.length;
    const jLength = board[0].length;
    const result = [];
    for (let i = 0; i < iLength; i++) {
      let iDrift = i;
      const row = [];
      for (let j = 0; j < jLength && iDrift < iLength; j++) {
        row.push(board[iDrift++][j]);
      }
      if (row.length >= 4) result.push(row);
    }
    for (let j = jLength - 1; j >= 0 ; j--) {
      let jDrift = j;
      const row = [];
      for (let i = 0; i < iLength && jDrift >= 0; i++) {
        row.push(board[i][jDrift--]);
      }
      if (row.length >= 4) result.push(row);
    }
    for (let i = iLength - 1; i >= 0; i--) {
      let iDrift = i;
      const row = [];
      for (let j = 0; j < jLength && iDrift >= 0; j++) {
        row.push(board[iDrift--][j]);
      }
      if (row.length >= 4) result.push(row);
    }    
    for (let j = jLength - 1; j >= 0; j--) {
      let jDrift = j;
      const row = [];
      for (let i = iLength - 1; i >= 0 && jDrift >= 0; i--) {
        row.push(board[i][jDrift--]);
      }
      if (row.length >= 4) result.push(row);
    }
    return result;
  };

  // Row win detection
  board.forEach((row, idx) => {
    const resultStr = row.toString().replaceAll(",", "");
    if (resultStr.indexOf("1111") >= 0 || resultStr.indexOf("2222") >= 0) {
      winner = resultStr.indexOf("1111") >= 0 ? 1 : 2;
    }
  });
  if (winner) return winner;

  // Column win detection
  for (let i = 0; i < board.length; i++) {
    const column = getColumn(i);
    const resultStr = column.toString().replaceAll(",", "");
    if (resultStr.indexOf("1111") >= 0 || resultStr.indexOf("2222") >= 0) {
      winner = resultStr.indexOf("1111") >= 0 ? 1 : 2;
    }
  }
  if (winner) return winner;

  // Diangle win detections
  const results = getDiangle();
  for (let i = 0; i < results.length; i++) {
    const resultStr = results[i].toString().replaceAll(",", "");
    if (resultStr.indexOf("1111") >= 0 || resultStr.indexOf("2222") >= 0) {
      winner = resultStr.indexOf("1111") >= 0 ? 1 : 2;
    }
  }

  return winner ? winner : undefined;
};

export function dropDisc(grid, x) {
  const newGrid = grid.slice()
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][+x].value == 0) continue
    newGrid[i - 1][+x].value = 1
    return [newGrid, [], [1, +x, i - 1]]
  }
  newGrid[grid.length - 1][+x].value = 1
  return [newGrid, [], [1, +x, grid.length - 1]]
}

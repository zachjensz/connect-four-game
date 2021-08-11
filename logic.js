export function createGrid(game_config) {
  const grid = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0))
  return grid
}

export function dropDisc(game_config, grid, x, player = 1) {
  for (let i = 0; i < game_config.height; i++) {
    if (grid[i + 1]?.[+x] == 0) continue
    if (grid[i]?.[+x] == 0) {
      grid[i][+x] = player
      return {
        location: [player, i, +x],
        seq: validSeq([grid, player, i, +x], game_config.min_sequence),
        newGrid: grid,
      }
    }
  }
}

function validSeq(state, min_sequence) {
  const winningSequences = []
  const directions = [
    { v: 1, h: 0 },
    { v: 1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: -1 },
  ]
  directions.forEach((dir) => {
    const seq = [...cast(state, dir.v, dir.h), ...cast(state, -dir.v, -dir.h)]
    if (seq.length > min_sequence - 2) winningSequences.push(seq)
  })
  return winningSequences
}

function cast([grid, value, y, x], dY, dX) {
  let discs = []
  for (let i = 1; grid[y + dY * i]?.[x + dX * i] == value; i++) {
    discs.push([y + dY * i, x + dX * i])
  }
  return discs
}

export function getColumnHeight(grid, x) {
  let height = 0
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][x] === 0) return height
    height++
  }
  return grid.length
}

const isGridFull = (grid) => {
  let full = true
  grid[0].forEach((disc) => (disc === 0 ? (full = false) : undefined))
  return full
}

// Credit: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
const rotateColumns = (grid) => {
  return grid[0].map((val, index) => grid.map((row) => row[index]).reverse())
}

const shearDiagonals = (grid) => {
  const iLength = grid.length,
    jLength = grid[0].length
  const result = []
  for (let i = 0; i < iLength; i++) {
    let rowUp = [],
      rowDown = []
    for (let j = 0, shearUp = i, shearDown = i; j < jLength; j++) {
      if (shearDown >= 0) rowDown.push(grid[shearDown--][j])
      if (shearUp < iLength) rowUp.push(grid[shearUp++][j])
    }
    if (rowUp.length >= 4) result.push(rowUp)
    if (rowDown.length >= 4) result.push(rowDown)
    rowUp = []
    rowDown = []
    for (let j = jLength - 1, shearUp = i, shearDown = i; j >= 0; j--) {
      if (shearDown >= 0) rowDown.push(grid[shearDown--][j])
      if (shearUp < iLength) rowUp.push(grid[shearUp++][j])
    }
    if (rowUp.length >= 4) result.push(rowUp)
    if (rowDown.length >= 4) result.push(rowDown)
  }
  return result
}

const getIndicesGrid = (grid) => {
  const indicesGrid = []
  for (let i = grid.length - 1; i >= 0; i--) {
    const row = []
    for (let j = 0; j < grid[0].length; j++) {
      row.push([i, j])
    }
    indicesGrid.push(row)
  }

  return indicesGrid
}

const findWinningMoves = (grid, player) => {
  let result = {
    player,
    // block is a list of columns that will block a player win
    // If more than one, the player is about to win.
    block: [],
    // restricted is a list of plays that would be a mistake to do as
    // they would give the player a piece needed to complete a diagonal win
    restricted: [],
  }

  const processResults = (resultStr) => [
    resultStr.indexOf(`${player}${player}${player}`),
    resultStr.indexOf(`${player}${player}0${player}`),
    resultStr.indexOf(`${player}0${player}${player}`),
  ]

  // Columns
  const rotated = rotateColumns(grid)
  for (let i = 0; i < rotated.length; i++) {
    const resultStr = rotated[i].toString().replaceAll(",", "")
    const [index1] = processResults(resultStr)
    if (index1 >= 0) {
      // Is the piece above this sequence empty?
      if (resultStr.indexOf(`${player}${player}${player}0`) >= 0)
        result.block.push(i)
    }
  }

  // Row
  for (let i = 0; i < grid.length; i++) {
    const resultStr = grid[i].toString().replaceAll(",", "")
    const [index1, index2, index3] = processResults(resultStr)
    if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
      if (index1 >= 0) {
        if (grid[i][index1 - 1] === 0) {
          const column = index1 - 1
          const columnHeight = getColumnHeight(grid, column)
          const row = Math.abs(grid.length - i) - 1
          if (row === columnHeight && result.block.indexOf(column) < 0)
            result.block.push(column)
          if (row - 1 === columnHeight && result.restricted.indexOf(column) < 0)
            result.restricted.push(column)
        }
        if (grid[i][index1 + 3] === 0) {
          const column = index1 + 3
          const columnHeight = getColumnHeight(grid, column)
          const row = Math.abs(grid.length - i) - 1
          if (row === columnHeight && result.block.indexOf(column) < 0)
            result.block.push(column)
          if (row - 1 === columnHeight && result.restricted.indexOf(column) < 0)
            result.restricted.push(column)
        }
      }
      if (index2) {
        const column = index2 + 2
        const columnHeight = getColumnHeight(grid, column)
        const row = Math.abs(grid.length - i) - 1
        if (row === columnHeight && result.block.indexOf(column) < 0)
          result.block.push(column)
        if (row - 1 === columnHeight && result.restricted.indexOf(column) < 0)
          result.restricted.push(column)
      }
      if (index3) {
        const column = index3 + 1
        const columnHeight = getColumnHeight(grid, column)
        const row = Math.abs(grid.length - i) - 1
        if (row === columnHeight && result.block.indexOf(column) < 0)
          result.block.push(column)
        if (row - 1 === columnHeight && result.restricted.indexOf(column) < 0)
          result.restricted.push(column)
      }
    }
  }

  // Diagonals
  const sheared = shearDiagonals(grid)
  // This is a shear for mapping back to the grid coordinates
  const shearedIndices = shearDiagonals(getIndicesGrid(grid))
  for (let i = 0; i < sheared.length; i++) {
    const resultStr = sheared[i].toString().replaceAll(",", "")
    const [index1, index2, index3] = processResults(resultStr)
    if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
      if (index1 >= 0) {
        let row = shearedIndices[i]?.[index1 - 1]?.[0]
        let column = shearedIndices[i]?.[index1 - 1]?.[1]
        if (row !== undefined && column != undefined) {
          const columnHeight = getColumnHeight(grid, column)
          if (grid[grid.length - row - 1][column] === 0) {
            if (columnHeight === row && result.block.indexOf(column) < 0) {
              result.block.push(column)
            } else if (
              columnHeight === row - 1 &&
              result.restricted.indexOf(column) < 0
            ) {
              result.restricted.push(column)
            }
          }
        }
        row = shearedIndices[i]?.[index1 + 3]?.[0]
        column = shearedIndices[i]?.[index1 + 3]?.[1]
        if (row !== undefined && column !== undefined) {
          const columnHeight = getColumnHeight(grid, column)
          if (grid[grid.length - row - 1][column] === 0) {
            console.log("Test2: ", row, column, columnHeight, shearedIndices[i])
            if (columnHeight === row && result.block.indexOf(column) < 0) {
              result.block.push(column)
            } else if (
              columnHeight === row - 1 &&
              result.restricted.indexOf(column) < 0
            ) {
              result.restricted.push(column)
            }
          }
        }
      } else {
        let index = index2 >= 0 ? index2 + 2 : index3 + 1
        let row = shearedIndices[i]?.[index]?.[0]
        let column = shearedIndices[i]?.[index]?.[1]
        if (row !== undefined && column !== undefined) {
          const columnHeight = getColumnHeight(grid, column)
          if (grid[grid.length - row - 1][column] === 0) {
            if (columnHeight === row && result.block.indexOf(column) < 0) {
              result.block.push(column)
            } else if (
              columnHeight - 1 === row &&
              result.restricted.indexOf(column) < 0
            ) {
              result.restricted.push(column)
            }
          }
        }
      }
    }
  }

  // I'm sure a bug is causing this, but this code will remove
  // result.restricted columns from results.block
  result.restricted.forEach((col) => {
    if (result.block.includes(col))
      result.block.splice(result.block.indexOf(col), 1)
  })
  // console.log(result)
  return result
}

export const computerMove = (game_config, grid, playerDrop) => {
  let column = -1
  if (isGridFull(grid)) return

  // Go for a winning move first
  const winResult = findWinningMoves(grid, 2) // Computer is player 2 atm
  if (winResult.block.length > 0) {
    column = winResult.block[0]
  }

  if (column >= 0) {
    const drop = dropDisc(game_config, grid, column, 2)
    if (drop) return drop
    throw new Error("drop failed")
  }

  // Block player winning moves
  const blockResult = findWinningMoves(grid, 1) // Opponent is player 1 atm
  if (blockResult.block.length > 0) column = blockResult.block[0]

  if (column >= 0) {
    const drop = dropDisc(game_config, grid, column, 2)
    if (drop) return drop
    throw new Error("drop failed")
  }

  // Random Drop
  column = -1
  const isColumnFull = (idx) => getColumnHeight(grid, idx) === grid.length
  const isRowEmpty = (idx) =>
    grid[idx].reduce(
      (previousValue, _, index) => previousValue + grid[idx][index],
      0
    )
  const isEarly = !isRowEmpty(grid.length - 3)
  const columnsTried = Array(game_config.width).fill(0)
  while (column < 0) {
    column = isEarly
      ? Math.floor(Math.random() * 5) + 1
      : Math.floor(Math.random() * 7)
    columnsTried[column] = 1
    const totalTried = columnsTried.reduce(
      (prev, curr, arr) => prev + curr,
      0
    )

    if (isColumnFull(column) && totalTried === game_config.width) break
    if (
      isColumnFull(column) ||
      // Don't play blocked columns if avoidable.
      (
        blockResult.restricted.indexOf(column) >= 0 &&
        totalTried < game_config.width - blockResult.restricted.length)
    ) {
      column = -1
      continue
    }

    const drop = dropDisc(game_config, grid, column, 2)
    if (drop) return drop
    throw new Error(
      `drop failed on column ${column}, ${getColumnHeight(grid, column)}, ${
        grid.length
      }`
    )
  }

  throw new Error("drop failed")
}

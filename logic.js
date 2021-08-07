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

const blockOpponent = (grid, player) => {
  let result = {
    block: [],
  }

  const processResults = (resultStr) => [
    resultStr.indexOf(`${player}${player}${player}`),
    resultStr.indexOf(`${player}${player}0${player}`),
    resultStr.indexOf(`${player}0${player}${player}`),
  ]

  // Row
  for (let i = 0; i < grid.length; i++) {
    const resultStr = grid[i].toString().replaceAll(",", "")
    const [index1, index2, index3] = processResults(resultStr)
    if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
      if (index1) {
        if (index1 >= 0 && grid[i][index1 - 1] === 0)
          result.block.push(index1 - 1)
        if (grid[i][index1 + 3] === 0) result.block.push(index1 + 3)
      } else {
        result.block.push(index2 >= 0 ? index2 + 2 : index3 + 1)
      }
    }
  }

  // Columns
  const rotated = rotateColumns(grid)
  for (let i = 0; i < rotated.length; i++) {
    const resultStr = rotated[i].toString().replaceAll(",", "")
    const [index1, index2, index3] = processResults(resultStr)
    if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
      // if (index1) {
      //   if (index1 >= 0 && grid[index][index1 - 1] === 0)
      //     result.block.push(index1 - 1)
      //   if (grid[index][index1 + 3] === 0) result.block.push(index1 + 3)
      // } else {
      //   result.block.push(index2 >= 0 ? index2 + 2 : index3 + 1)
      // }
    }
  }

  // Diagonals
  // const sheared = shearDiagonals(grid)
  // for (let i = 0; i < sheared.length; i++) {
  //   const resultStr = sheared[i].toString().replaceAll(",", "")
  //   processResults(resultStr, i)
  // }

  return result
}

export const computerMove = (game_config, grid, playerDrop) => {
  let column = -1
  if (isGridFull(grid)) return

  // Block player wins
  const blockResult = blockOpponent(grid, 1) // Opponent is player 1 atm
  if (blockResult.block.length > 0) {
    console.log(blockResult)
    column = blockResult.block[0]
  }

  if (column >= 0) {
    const drop = dropDisc(game_config, grid, column, 2)
    if (drop) return drop
    column = -1
  }

  // Random Drop
  const isRowEmpty = (idx) => grid[idx].reduce(
    (previousValue, _, index) => previousValue + grid[idx][index], 0
  )
  const isEarly = !isRowEmpty(grid.length - 3)
  while (column < 0) {
    column = isEarly ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 7)
    if (grid[0][column] !== 0) continue
    const drop = dropDisc(game_config, grid, column, 2)
    return drop
  }
}

import { computerMove as computerMoveDumb } from './logic-dumbot.js'
import { computerMove as computerMoveSmart } from './logic-smartbot.js'
import { computerMove as computerMoveTerminator } from './logic-terminator.js'

// Called after the player move
export const computerMove = (game_config, grid, playerDrop) => {
    if (game_config.difficulty === 1)
      return computerMoveDumb(game_config, grid, playerDrop)
    if (game_config.difficulty === 2)
      return computerMoveSmart(game_config, grid, playerDrop)
    if (game_config.difficulty === 3)
      return computerMoveTerminator(game_config, grid, playerDrop)
  }
  
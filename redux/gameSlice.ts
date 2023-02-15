import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { IGame } from "../pages/api/lib/interfaces/IGame"

const initialState: IGame = {
  id: "",
  name: "",
  tags: [],
  provider: "",
  gameType: "",
}

export const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    saveGame: (game, action: PayloadAction<IGame>) => {
      const { id, name, tags, provider, gameType } = action.payload
      game.id = id
      game.name = name
      game.tags = tags
      game.provider = provider
      game.gameType = gameType
    },
    removeGame: (game) => {
      game.id = ""
      game.name = ""
      game.tags = []
      game.provider = ""
      game.gameType = ""
    },
  },
})

// Export Game Actions
export const { saveGame, removeGame } = gameSlice.actions

// Exports Game Reducer
const gamesReducer = gameSlice.reducer
export default gamesReducer

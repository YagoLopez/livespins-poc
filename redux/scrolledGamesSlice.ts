import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { IGame } from "../pages/api/lib/interfaces/IGame"
import { InfiniteData } from "@tanstack/query-core"

const initialState: any = { pages: [], pageParams: [] }

export const scrolledGamesSlice = createSlice({
  name: "scrolledGames",
  initialState,
  reducers: {
    saveScrolledGames: (
      state,
      action: PayloadAction<InfiniteData<IGame[]> | null>
    ) => {
      state = action.payload
      return state
    },
  },
})

export const { saveScrolledGames } = scrolledGamesSlice.actions

const scrolledGamesReducer = scrolledGamesSlice.reducer
export default scrolledGamesReducer

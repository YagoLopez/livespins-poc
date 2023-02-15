import { configureStore } from "@reduxjs/toolkit"
import gamesReducer from "./gameSlice"
import scrolledGamesReducer from "./scrolledGamesSlice"
import { useDispatch } from "react-redux"

export const store = configureStore({
  reducer: {
    game: gamesReducer,
    scrolledGames: scrolledGamesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {game: GameState}
export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
export const useAppDispatch: () => AppDispatch = useDispatch

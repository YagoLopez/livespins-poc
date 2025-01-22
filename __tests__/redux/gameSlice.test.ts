import gamesReducer, { saveGame, removeGame } from "../../redux/gameSlice"
import { IGame } from "../../pages/api/lib/interfaces/IGame"

describe("Game Slice", () => {
  const initialState: IGame = {
    id: "",
    name: "",
    tags: [],
    provider: "",
    gameType: "",
  }

  const sampleGame: IGame = {
    id: "game-123",
    name: "Sample Game",
    tags: ["action", "adventure"],
    provider: "Test Provider",
    gameType: "arcade",
  }

  it("should handle initial state", () => {
    expect(gamesReducer(undefined, { type: "unknown" })).toEqual(initialState)
  })

  it("should handle saveGame", () => {
    const actual = gamesReducer(initialState, saveGame(sampleGame))
    expect(actual).toEqual(sampleGame)
  })

  it("should handle removeGame", () => {
    const gameState = gamesReducer(initialState, saveGame(sampleGame))
    const actual = gamesReducer(gameState, removeGame())
    expect(actual).toEqual(initialState)
  })

  it("should handle partial game data", () => {
    const partialGame: IGame = {
      ...initialState,
      id: "partial-123",
      name: "Partial Game",
    }
    const actual = gamesReducer(initialState, saveGame(partialGame))
    expect(actual.id).toBe("partial-123")
    expect(actual.name).toBe("Partial Game")
    expect(actual.tags).toEqual([])
  })
})

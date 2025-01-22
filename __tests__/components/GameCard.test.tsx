import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { useRouter } from "next/router"
import { useQueryClient } from "@tanstack/react-query"
import GameCard from "../../components/GameCard"
import { useAppDispatch } from "../../redux/store"
import { saveGame } from "../../redux/gameSlice"
import { saveScrolledGames } from "../../redux/scrolledGamesSlice"
import { IGame } from "../../pages/api/lib/interfaces/IGame"
import { InfiniteData } from "@tanstack/query-core"

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

// Mock Redux hooks
jest.mock("../../redux/store", () => ({
  useAppDispatch: jest.fn(),
}))

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}))

describe("GameCard", () => {
  const mockGame = {
    id: "game1",
    name: "Test Game",
    gameType: "Slots",
    provider: "Test Provider",
    tags: ["tag1", "tag2"],
    image: "test-image.jpg",
  }

  const mockSearchString = "test"
  const mockDispatch = jest.fn()
  const mockPush = jest.fn()
  const mockGetQueryData = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
    ;(useQueryClient as jest.Mock).mockReturnValue({
      getQueryData: mockGetQueryData,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders game card with correct information", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    expect(screen.getByText(mockGame.name)).toBeInTheDocument()
    expect(screen.getByText(`by ${mockGame.provider}`)).toBeInTheDocument()
    expect(screen.getByTitle(mockGame.name)).toBeInTheDocument()
  })

  test("handles game click correctly", () => {
    const mockScrolledGames = {
      pages: [[mockGame]],
    }
    mockGetQueryData.mockReturnValue(mockScrolledGames)

    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    const gameCard = screen.getByTitle(mockGame.name)
    fireEvent.click(gameCard)

    expect(mockDispatch).toHaveBeenCalledWith(saveGame(mockGame))
    expect(mockDispatch).toHaveBeenCalledWith(
      saveScrolledGames(mockScrolledGames as InfiniteData<IGame[]>)
    )
    expect(mockPush).toHaveBeenCalledWith(`/${mockGame.id}`, undefined, {
      shallow: true,
    })
  })

  test("displays parsed game type correctly", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    expect(screen.getByText("Slots")).toBeInTheDocument()
  })

  test("displays parsed tags correctly", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    expect(screen.getByText(/tag1/i)).toBeInTheDocument()
    expect(screen.getByText(/tag2/i)).toBeInTheDocument()
  })

  test("applies correct background image style", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    const bgElement = screen.getByTitle(mockGame.name)
    expect(bgElement).toHaveStyle({
      backgroundImage: `url(${mockGame.image})`,
    })
  })
})

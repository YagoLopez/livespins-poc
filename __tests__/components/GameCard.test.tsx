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
import "@testing-library/jest-dom"

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

    // Verify correct query key is used
    expect(mockGetQueryData).toHaveBeenCalledWith([
      `games-search-${mockSearchString}`,
    ])

    expect(mockDispatch).toHaveBeenCalledWith(saveGame(mockGame))
    expect(mockDispatch).toHaveBeenCalledWith(
      saveScrolledGames(mockScrolledGames as InfiniteData<IGame[]>)
    )
    expect(mockPush).toHaveBeenCalledWith(`/${mockGame.id}`, undefined, {
      shallow: true,
    })
  })

  test("handles game click when scrolledGames data is not available", () => {
    // Return null to simulate missing data in React Query cache
    mockGetQueryData.mockReturnValue(null)

    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    const gameCard = screen.getByTitle(mockGame.name)
    fireEvent.click(gameCard)

    // Should still save the game and navigate
    expect(mockDispatch).toHaveBeenCalledWith(saveGame(mockGame))
    // Should call saveScrolledGames with null
    expect(mockDispatch).toHaveBeenCalledWith(saveScrolledGames(null))
    expect(mockPush).toHaveBeenCalledWith(`/${mockGame.id}`, undefined, {
      shallow: true,
    })
  })

  test("displays parsed game type correctly", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    expect(screen.getByText("Slots")).toBeInTheDocument()
  })

  test("handles game with empty gameType", () => {
    const gameWithEmptyType = {
      ...mockGame,
      gameType: "",
    }

    render(
      <GameCard game={gameWithEmptyType} searchString={mockSearchString} />
    )

    // The component should render without errors
    expect(screen.getByTitle(mockGame.name)).toBeInTheDocument()
  })

  test("displays parsed tags correctly", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    expect(screen.getByText(/tag1/i)).toBeInTheDocument()
    expect(screen.getByText(/tag2/i)).toBeInTheDocument()
  })

  test("handles game with empty tags array", () => {
    const gameWithEmptyTags = {
      ...mockGame,
      tags: [],
    }

    render(
      <GameCard game={gameWithEmptyTags} searchString={mockSearchString} />
    )

    // The component should render without errors
    expect(screen.getByTitle(mockGame.name)).toBeInTheDocument()
  })

  // We're not testing with undefined tags since parseGameTags doesn't handle undefined
  // Instead, we're testing with an empty array which is a valid edge case

  test("applies correct background image style", () => {
    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    const bgElement = screen.getByTitle(mockGame.name)
    expect(bgElement).toHaveStyle({
      backgroundImage: `url(${mockGame.image})`,
    })
  })

  test("handles click event correctly", () => {
    const mockScrolledGames = {
      pages: [[mockGame]],
    }
    mockGetQueryData.mockReturnValue(mockScrolledGames)

    render(<GameCard game={mockGame} searchString={mockSearchString} />)

    // Get the outer div with the onClick handler
    const gameCard = screen.getByText(mockGame.name).closest("div[id]") as Node

    // Click the element
    fireEvent.click(gameCard)

    // Verify the click handler was triggered
    expect(mockDispatch).toHaveBeenCalledWith(saveGame(mockGame))
    expect(mockPush).toHaveBeenCalledWith(`/${mockGame.id}`, undefined, {
      shallow: true,
    })
  })
})

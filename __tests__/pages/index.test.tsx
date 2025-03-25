import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Lobby from "../../pages/index"
import gameReducer from "../../redux/gameSlice"
import scrolledGamesReducer from "../../redux/scrolledGamesSlice"
import { GamesRepositoryMock } from "../../pages/api/lib/repositories/games.repository.mock"
import { IGame } from "../../pages/api/lib/interfaces/IGame"
import "@testing-library/jest-dom"

const gamesRepositoryMock = new GamesRepositoryMock()

// Mock game data
const mockGame: IGame = {
  id: "game1",
  name: "Test Game",
  gameType: "Slots",
  provider: "Test Provider",
  tags: ["tag1", "tag2"],
  image: "test-image.jpg",
}

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    game: gameReducer,
    scrolledGames: scrolledGamesReducer,
  },
  preloadedState: {
    game: mockGame,
    scrolledGames: {
      pages: [[mockGame]],
      pageParams: [null],
    },
  },
})

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={new QueryClient()}>
        {component}
      </QueryClientProvider>
    </Provider>
  )
}

describe("Lobby Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock getElementById
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === mockGame.id) {
        return document.createElement("div")
      }
      return null
    })
  })

  it("renders initial state correctly", () => {
    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders game list", async () => {
    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )
    expect(await screen.findByText("Book of Gems Megaways")).toBeInTheDocument()
    expect(await screen.findByText("The Last Kingdom")).toBeInTheDocument()
  })

  it("updates search state when input value changes", () => {
    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )
    const searchInput = screen.getByRole("textbox")
    fireEvent.change(searchInput, { target: { value: "test" } })
    expect(searchInput).toHaveValue("test")
  })

  it("shows loading state", async () => {
    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )
    const gameList = document.querySelector(".overflow-y-auto")

    if (gameList) {
      fireEvent.scroll(gameList, { target: { scrollTop: 100 } })
      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument()
      })
    }
  })

  it("handles server-side props correctly", async () => {
    const { getServerSideProps } = require("../../pages/index")
    const context = {
      query: { search: "test search" },
    }

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: { search: "test search" },
    })
  })

  it("handles empty search query in server-side props", async () => {
    const { getServerSideProps } = require("../../pages/index")
    const context = {
      query: {},
    }

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: { search: "" },
    })
  })

  it("scrolls selected game into viewport", () => {
    renderWithProviders(
      <Lobby search="poker" gamesRepository={gamesRepositoryMock} />
    )

    // The useEffect should trigger scrollIntoView
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })

  it("renders loader when fetching data", () => {
    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("initializes with search prop", () => {
    renderWithProviders(
      <Lobby search="test search" gamesRepository={gamesRepositoryMock} />
    )

    // The input should be initialized with the search prop
    expect(screen.getByRole("textbox")).toHaveValue("test search")
  })

  // Mock useAppDispatch for the dispatch test
  it("saves scrolled games to Redux store", async () => {
    // Create a spy on the store's dispatch method
    const dispatchSpy = jest.spyOn(mockStore, "dispatch")

    renderWithProviders(
      <Lobby search="" gamesRepository={gamesRepositoryMock} />
    )

    // Wait for the useEffect to dispatch the action
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled()
    })

    // Clean up
    dispatchSpy.mockRestore()
  })
})

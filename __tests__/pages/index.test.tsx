import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Lobby from "../../pages/index"
import gameReducer from "../../redux/gameSlice"
import scrolledGamesReducer from "../../redux/scrolledGamesSlice"
import "@testing-library/jest-dom"
import { GamesRepositoryMock } from "../../pages/api/lib/repositories/games.repository.mock"

const gamesRepository = new GamesRepositoryMock()

const mockStore = configureStore({
  reducer: {
    game: gameReducer,
    scrolledGames: scrolledGamesReducer,
  },
})

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
    // Reset intersection observer mock
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
  })

  it("renders initial state correctly", () => {
    renderWithProviders(<Lobby search="" gamesRepository={gamesRepository} />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders game list", async () => {
    renderWithProviders(<Lobby search="" gamesRepository={gamesRepository} />)
    expect(await screen.findByText("Book of Gems Megaways")).toBeInTheDocument()
    expect(await screen.findByText("The Last Kingdom")).toBeInTheDocument()
  })

  it("updates search state when input value changes", () => {
    renderWithProviders(<Lobby search="" gamesRepository={gamesRepository} />)
    const searchInput = screen.getByRole("textbox")
    fireEvent.change(searchInput, { target: { value: "test" } })
    expect(searchInput).toHaveValue("test")
  })

  it("shows loading state", async () => {
    renderWithProviders(<Lobby search="" gamesRepository={gamesRepository} />)
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
})

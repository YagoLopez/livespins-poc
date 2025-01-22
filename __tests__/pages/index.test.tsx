import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Lobby from "../../pages/index"
import gameReducer from "../../redux/gameSlice"
import scrolledGamesReducer from "../../redux/scrolledGamesSlice"
import "@testing-library/jest-dom"

const mockStore = configureStore({
  reducer: {
    game: gameReducer,
    scrolledGames: scrolledGamesReducer,
  },
})

const queryClient = new QueryClient()

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
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
    renderWithProviders(<Lobby search="" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  // it("updates search input value when search prop changes", async () => {
  //   // const { rerender } = renderWithProviders(<Lobby search="" />)
  //   renderWithProviders(<Lobby search="" />)
  //   const searchInput = screen.getByRole("textbox")
  //
  //   // rerender(<Lobby search="new search" />)
  //   await waitFor(() => {
  //     expect(searchInput).toHaveValue("new search")
  //   })
  // })

  it("shows loading state", async () => {
    renderWithProviders(<Lobby search="" />)
    const gameList = document.querySelector(".overflow-y-auto")

    if (gameList) {
      fireEvent.scroll(gameList, { target: { scrollTop: 100 } })
      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument()
      })
    }
  })

  // it("scrolls to top when up arrow button is clicked", async () => {
  //   renderWithProviders(<Lobby search="" />)
  //   const gameList = document.querySelector(".overflow-y-auto")
  //
  //   if (gameList) {
  //     fireEvent.scroll(gameList, { target: { scrollTop: 100 } })
  //     const scrollButton = await screen.findByTitle("Scroll to top")
  //
  //     fireEvent.click(scrollButton)
  //     await waitFor(() => {
  //       expect(gameList.scrollTop).toBe(0)
  //     })
  //   }
  // })

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

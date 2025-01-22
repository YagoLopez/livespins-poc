import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import GameList from "../../components/GameList"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import gameReducer from "../../redux/gameSlice"
import scrolledGamesReducer from "../../redux/scrolledGamesSlice"

const queryClient = new QueryClient()

const mockStore = configureStore({
  reducer: {
    game: gameReducer,
    scrolledGames: scrolledGamesReducer,
  },
})

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>
  )
}

describe("GameList Component", () => {
  const mockFetchNextPage = jest.fn()
  const mockRef = {
    current: <div>test ref</div>,
  } as any
  const mockLoadMoreBtnRef = { current: <button>Load More</button> }

  const mockGameData = {
    pages: [
      {
        data: [
          {
            id: "1",
            name: "Test Game 1",
            tags: "tag1, tag2",
            provider: "Test Provider",
            gameType: "Test Game Type",
          },
          {
            id: "2",
            name: "Test Game 2",
            tags: "tag3, tag4",
            provider: "Test Provider",
            gameType: "Test Game Type",
          },
        ],
      },
    ],
    pageParams: [0],
  }

  const defaultProps = {
    gameList: mockGameData,
    inputSearchState: "",
    loadMoreBtnRef: mockLoadMoreBtnRef,
    fetchNextPage: mockFetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    classes: "test-class",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders game list correctly", () => {
    // @ts-ignore
    renderWithProviders(<GameList {...defaultProps} ref={mockRef} />)
    expect(screen.getByText("Test Game 1")).toBeInTheDocument()
    expect(screen.getByText("Test Game 2")).toBeInTheDocument()
  })

  it("handles empty game list", () => {
    const emptyProps = {
      ...defaultProps,
      gameList: { pages: [], pageParams: [] },
    }
    // @ts-ignore
    renderWithProviders(<GameList {...emptyProps} ref={mockRef} />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("shows loading state when fetching next page", () => {
    const loadingProps = {
      ...defaultProps,
      isFetchingNextPage: true,
    }
    // @ts-ignore
    renderWithProviders(<GameList {...loadingProps} ref={mockRef} />)
    expect(screen.getByText("Loading more...")).toBeInTheDocument()
  })

  it("disables load more button when no more pages", () => {
    const noMorePagesProps = {
      ...defaultProps,
      hasNextPage: false,
    }
    // @ts-ignore
    renderWithProviders(<GameList {...noMorePagesProps} ref={mockRef} />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("calls fetchNextPage when load more button is clicked", () => {
    // @ts-ignore
    renderWithProviders(<GameList {...defaultProps} ref={mockRef} />)
    fireEvent.click(screen.getByRole("button"))
    expect(mockFetchNextPage).toHaveBeenCalledWith({ pageParam: 10 })
  })

  it("applies correct class name to container", () => {
    // @ts-ignore
    renderWithProviders(<GameList {...defaultProps} ref={mockRef} />)
    const container = screen.getByRole("button").parentElement
    expect(container).toHaveClass("test-class")
  })

  it("handles undefined game list gracefully", () => {
    const undefinedProps = {
      ...defaultProps,
      gameList: undefined,
    }
    // @ts-ignore
    renderWithProviders(<GameList {...undefinedProps} ref={mockRef} />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})

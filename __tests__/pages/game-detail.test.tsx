import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
// import GameDetail from "../index"
import "@testing-library/jest-dom"
import { useRouter } from "next/router"
import GameDetail from "../../pages/[gameId]"

const onClickBackBtnMock = jest.fn()

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    back: onClickBackBtnMock,
  }),
}))

// Mock redux initial state
const mockInitialState = {
  game: {
    name: "Test Game",
    provider: "Test Provider",
    tags: ["action", "adventure"],
  },
}

// Create mock store
const mockStore = configureStore({
  reducer: {
    game: (state = mockInitialState.game) => state,
  },
})

describe("GameDetail Component", () => {
  const renderWithRedux = () => {
    return render(
      <Provider store={mockStore}>
        <GameDetail />
      </Provider>
    )
  }

  it("renders game details correctly", () => {
    renderWithRedux()

    expect(screen.getByText("Test Game")).toBeInTheDocument()
    expect(screen.getByText("Provided by: Test Provider")).toBeInTheDocument()
    expect(screen.getByText("action - adventure")).toBeInTheDocument()
  })

  it("renders video elements", () => {
    renderWithRedux()

    const videos = screen.getAllByTestId("video")
    expect(videos).toHaveLength(2)
    videos.forEach((video) => {
      expect(video).toHaveAttribute("autoplay")
      expect(video).toHaveAttribute("playsinline")
      expect(video).toHaveAttribute("loop")
    })
  })

  it("renders carousel navigation buttons", () => {
    renderWithRedux()

    expect(screen.getByText("Previous")).toBeInTheDocument()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("renders back to games button and handles click", () => {
    renderWithRedux()

    const { back } = useRouter()
    const backButtons = screen.getAllByText("Back To Games")
    screen.debug(backButtons)
    expect(backButtons).toHaveLength(2)

    fireEvent.click(backButtons[0])
    expect(onClickBackBtnMock).toHaveBeenCalled()
  })

  it("renders with empty game data", () => {
    const emptyStore = configureStore({
      reducer: {
        game: () => ({
          name: "",
          provider: "",
          tags: [],
        }),
      },
    })

    render(
      <Provider store={emptyStore}>
        <GameDetail />
      </Provider>
    )

    expect(screen.getByText("Game Name")).toBeInTheDocument()
    expect(screen.getByText("Provided by:")).toBeInTheDocument()
  })
})

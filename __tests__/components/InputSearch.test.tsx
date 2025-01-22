import React, { RefObject } from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { useRouter } from "next/router"
import InputSearch from "../../components/InputSearch"

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

describe("InputSearch", () => {
  const mockRouter = {
    push: jest.fn(),
  }
  const mockSetInputSearchState = jest.fn()
  const mockGameListRef = { current: { scrollTo: jest.fn() } } as RefObject<any>
  const inputRef = { current: null }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it("renders search input with correct placeholder", () => {
    render(
      <InputSearch
        inputSearchState=""
        setInputSearchState={mockSetInputSearchState}
        gameListRef={mockGameListRef}
        classes="test-class"
        ref={inputRef}
      />
    )

    expect(
      screen.getByPlaceholderText("Search Game (eg. Poker, Slots, Blackjack)")
    ).toBeInTheDocument()
  })

  it("handles search submission correctly", () => {
    render(
      <InputSearch
        inputSearchState=""
        setInputSearchState={mockSetInputSearchState}
        gameListRef={mockGameListRef}
        classes="test-class"
        ref={inputRef}
      />
    )

    const form = screen.getByRole("form")
    const input = screen.getByRole("textbox")

    fireEvent.change(input, { target: { value: "poker" } })
    fireEvent.submit(form)

    expect(mockRouter.push).toHaveBeenCalledWith("/?search=poker", undefined, {
      shallow: false,
    })
    expect(mockGameListRef.current.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it("shows clear button when search has value", () => {
    render(
      <InputSearch
        inputSearchState="poker"
        setInputSearchState={mockSetInputSearchState}
        gameListRef={mockGameListRef}
        classes="test-class"
        ref={inputRef}
      />
    )

    expect(screen.getByTitle("Clear Search")).toBeInTheDocument()
  })

  it("clears search when clear button is clicked", () => {
    render(
      <InputSearch
        inputSearchState="poker"
        setInputSearchState={mockSetInputSearchState}
        gameListRef={mockGameListRef}
        classes="test-class"
        ref={inputRef}
      />
    )

    const clearButton = screen.getByTitle("Clear Search")
    fireEvent.click(clearButton)

    expect(mockSetInputSearchState).toHaveBeenCalledWith("")
    expect(mockRouter.push).toHaveBeenCalledWith("/", undefined, {
      shallow: false,
    })
    expect(mockGameListRef.current.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it("auto-clears search when input becomes empty", () => {
    render(
      <InputSearch
        inputSearchState=""
        setInputSearchState={mockSetInputSearchState}
        gameListRef={mockGameListRef}
        classes="test-class"
        ref={inputRef}
      />
    )

    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "search term" } })
    fireEvent.change(input, { target: { value: "" } })

    expect(mockSetInputSearchState).toHaveBeenCalledWith("")
    expect(mockRouter.push).toHaveBeenCalledWith("/", undefined, {
      shallow: false,
    })
  })
})

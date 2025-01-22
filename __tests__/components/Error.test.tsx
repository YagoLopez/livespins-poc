import { render, screen } from "@testing-library/react"
import Error from "../../components/Error"

describe("Error component", () => {
  it("renders error message correctly", () => {
    const error = { message: "Test error message" }
    const { container } = render(<Error error={error} />)

    expect(
      screen.getByText(/There was an error: Test error message/i)
    ).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("flex", "justify-center", "w-full")
  })

  it("handles undefined error gracefully", () => {
    const { container } = render(<Error error={undefined} />)

    expect(screen.getByText("There was an error:")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("text-red-400")
  })

  it("handles null error message gracefully", () => {
    const error = { message: null }
    render(<Error error={error} />)

    expect(screen.getByText("There was an error:")).toBeInTheDocument()
  })

  it("handles error object without message property", () => {
    const error = {}
    render(<Error error={error} />)

    expect(screen.getByText("There was an error:")).toBeInTheDocument()
  })
})

import React from "react"
import { render, screen } from "@testing-library/react"
import Logo from "../../components/Logo"

describe("Logo Component", () => {
  it("renders without crashing", () => {
    render(<Logo classes="test-class" />)
    const logoImage = screen.getByAltText("Live Spins Logo")
    expect(logoImage).toBeInTheDocument()
  })

  it("applies provided classes to wrapper div", () => {
    const testClass = "custom-class"
    const { container } = render(<Logo classes={testClass} />)
    expect(container.firstChild).toHaveClass(testClass)
  })

  it("has correct image source", () => {
    render(<Logo classes="test-class" />)
    const logoImage = screen.getByAltText("Live Spins Logo")
    expect(logoImage).toHaveAttribute("src", "livespins-logo.png")
  })

  it("has responsive margin class on image", () => {
    render(<Logo classes="test-class" />)
    const logoImage = screen.getByAltText("Live Spins Logo")
    expect(logoImage).toHaveClass("md:-ml-10")
  })
})

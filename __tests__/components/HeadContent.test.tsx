import { render } from "@testing-library/react"
import React from "react"
import HeadContent from "../../components/HeadContent"

// Mock Next.js Head component
jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return (
        <>
          {children.map((child, index) => (
            <div key={index}>{child}</div>
          ))}
        </>
      )
    },
  }
})

describe("HeadContent", () => {
  it("renders head content correctly", () => {
    const { container } = render(<HeadContent />)

    // Get all meta tags
    const metaTags = container.getElementsByTagName("meta")
    const title = container.getElementsByTagName("title")[0]

    // Test title content
    expect(title.textContent).toBe("Casino Lobby. By Yago López")

    // Test viewport meta tag
    expect(metaTags[0].getAttribute("name")).toBe("viewport")
    expect(metaTags[0].getAttribute("content")).toBe(
      "initial-scale=1.0, width=device-width"
    )

    // Test description meta tag
    expect(metaTags[1].getAttribute("name")).toBe("description")
    expect(metaTags[1].getAttribute("content")).toBe(
      "LiveSpins Exercise. By Yago López"
    )
  })

  it("renders all required meta tags", () => {
    const { container } = render(<HeadContent />)
    const metaTags = container.getElementsByTagName("meta")

    expect(metaTags.length).toBe(2)
  })

  it("renders title element", () => {
    const { container } = render(<HeadContent />)
    const titleElements = container.getElementsByTagName("title")

    expect(titleElements.length).toBe(1)
  })
})

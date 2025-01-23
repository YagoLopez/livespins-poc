import { parseGameTags } from "../../pages/api/lib/utils/misc"
import { describe, expect, it } from "@jest/globals"

describe("parseGameTags", () => {
  it('should return tags separated by " • " when there are 3 or fewer tags', () => {
    const tags = ["action", "adventure", "puzzle"]
    const result = parseGameTags(tags)
    expect(result).toBe("action • adventure • puzzle")
  })

  it('should return first 3 tags followed by "+n more" when there are more than 3 tags', () => {
    const tags = ["action", "adventure", "puzzle", "strategy", "rpg"]
    const result = parseGameTags(tags)
    expect(result).toBe("action • adventure • puzzle • +2 more")
  })

  it("should return an empty string when the input array is empty", () => {
    const tags: string[] = []
    const result = parseGameTags(tags)
    expect(result).toBe("")
  })
})

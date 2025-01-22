import { GamesRepositoryMock } from "../../pages/api/lib/repositories/games.repository.mock"

describe("GamesRepositoryMock", () => {
  let repository: GamesRepositoryMock

  beforeEach(() => {
    repository = new GamesRepositoryMock()
  })

  describe("getById", () => {
    it("should return mock game data with expected structure", () => {
      const result = repository.getById("any-id", [])

      expect(result).toEqual({
        id: "1",
        name: "Test Game 1",
        tags: ["tag1", "tag2"],
        provider: "Test Provider",
        gameType: "Test Game Type",
      })
    })
  })

  describe("search", () => {
    it("should return paginated mock game data", async () => {
      const searchParams = {
        searchString: "",
        pageParam: 1,
      }

      const result = await repository.search(searchParams)

      expect(result).toHaveProperty("page")
      expect(result).toHaveProperty("per_page")
      expect(result).toHaveProperty("total")
      expect(result).toHaveProperty("data")
      expect(Array.isArray(result.data)).toBeTruthy()
      expect(result.data.length).toBeGreaterThan(0)
    })

    it("should return games with correct data structure", async () => {
      const searchParams = {
        searchString: "",
        pageParam: 1,
      }

      const result = await repository.search(searchParams)
      const firstGame = result.data[0]

      expect(firstGame).toHaveProperty("id")
      expect(firstGame).toHaveProperty("name")
      expect(firstGame).toHaveProperty("tags")
      expect(firstGame).toHaveProperty("provider")
      expect(firstGame).toHaveProperty("gameType")
      expect(firstGame).toHaveProperty("image")
    })
  })

  describe("Singleton", () => {
    it("should return same instance when created multiple times", () => {
      const instance1 = new GamesRepositoryMock()
      const instance2 = new GamesRepositoryMock()

      expect(instance1).toBe(instance2)
    })
  })

  describe("Repository properties", () => {
    it("should have correct name and baseURL", () => {
      expect(repository.name).toBe("games-mock")
      expect(repository.baseURL).toBe("/api")
    })
  })
})

import { IRepository } from "../interfaces/IRepository"
import { IGame } from "../interfaces/IGame"
import { ISearchParam } from "../interfaces/ISearchParam"
import { Singleton } from "../utils/singleton"

@Singleton
export class GamesRepositoryMock implements IRepository<IGame> {
  readonly name = "games-mock"
  readonly baseURL = "/api"

  getById(id: string, collection: IGame[]): IGame {
    return {
      id: "1",
      name: "Test Game 1",
      tags: ["tag1", "tag2"],
      provider: "Test Provider",
      gameType: "Test Game Type",
    }
  }

  search(): Promise<any> {
    return Promise.resolve({
      page: 1,
      per_page: 10,
      pre_page: null,
      next_page: null,
      total: 2,
      total_pages: 1,
      data: [
        {
          id: "relax_skywind_rlx.sw.sw.sw_boofgemenobufe",
          name: "Book of Gems Megaways",
          tags: [
            "High Volatility",
            "Free Spins Feature",
            "Megaways",
            "Special Wilds",
            "Expanding Wilds",
            "Multiplying Wilds",
            "Egypt",
            "Gems",
            "Scatter",
            "Skywind",
          ],
          provider: "Skywind",
          gameType: "video_slots",
          image: "./game-card-bg-black.svg",
        },
        {
          id: "relax_skywind_rlx.sw.sw.sw_thlaki",
          name: "The Last Kingdom",
          tags: [
            "High Volatility",
            "Big Multipliers",
            "Bonus Game",
            "Free Spins Feature",
            "Stacked Wilds",
            "Skywind",
          ],
          provider: "Skywind",
          gameType: "video_slots",
          image: "./game-card-bg-red.svg",
        },
      ],
    })
  }
}

/* istanbul ignore file */
import axios from "axios"
import { Singleton } from "../utils/singleton"
import { IGame } from "../interfaces/IGame"
import { IRepository } from "../interfaces/IRepository"
import { ISearchParam } from "../interfaces/ISearchParam"

@Singleton
export class GamesRepository implements IRepository<IGame> {
  readonly name = "games"
  readonly baseURL = "/api"
  readonly axiosClient = axios.create({ baseURL: this.baseURL })

  getById = (id: string, collection: IGame[]): IGame =>
    collection?.filter((game: IGame) => game.id === id)[0]

  search = async ({
    searchString,
    pageParam = 1,
  }: ISearchParam): Promise<IGame[]> => {
    if (pageParam) {
      const { data } = await this.axiosClient(
        `/search?search=${searchString}&page=${pageParam}`
      )
      return data
    } else {
      return []
    }
  }
}

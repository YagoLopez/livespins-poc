import { ISearchParam } from "./ISearchParam"
import IPage from "./IPage"

export interface IRepository<T> {
  readonly name: string

  readonly baseURL: string

  getById(id: string, collection: T[]): T

  search({ searchString, pageParam }: ISearchParam): Promise<T[]>
}

import { ISearchParam } from "./ISearchParam"

export interface IRepository<T> {
  readonly name: string

  readonly baseURL: string

  getById(id: string, collection: T[]): T

  search({ searchString, pageParam }: ISearchParam): Promise<T[]>
}

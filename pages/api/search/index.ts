import { NextApiRequest, NextApiResponse } from "next"
import allGames from "../data/games.json"
import paginator from "../lib/utils/paginator"
const JsonSearch = require("search-array").default

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, search } = req.query
  const searchEngine = new JsonSearch(allGames, {
    indice: { name: "name" },
  })

  try {
    if (search === "") {
      const allGamesPaginated = paginator(allGames, Number(page))
      res.status(200).json(allGamesPaginated)
    } else {
      const gamesFound = searchEngine.query(`'${search}'`)
      const gamesFoundPaginated = paginator(gamesFound, Number(page))
      res.status(200).json(gamesFoundPaginated)
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

import { NextApiRequest, NextApiResponse } from "next"
import allGames from "../data/games.json"
import paginator from "../lib/utils/paginator"
import { IGame } from "../lib/interfaces/IGame"
const JsonSearch = require("search-array").default

const colors = [
  "./game-card-bg-blue.svg",
  "./game-card-bg-cyan.svg",
  "./game-card-bg-red.svg",
  "./game-card-bg-white.svg",
  "./game-card-bg-yellow.svg",
  "./game-card-bg-green.svg",
  "./game-card-bg-black.svg",
]

const settGameImage = (game: IGame) =>
  (game.image = colors[Math.floor(Math.random() * 7)])

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, search } = req.query
  allGames.map((game: IGame) => settGameImage(game))
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

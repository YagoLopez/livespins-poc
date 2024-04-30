import React from "react"
import { IGame } from "../pages/api/lib/interfaces/IGame"
import { useRouter } from "next/router"
import { useAppDispatch } from "../redux/store"
import { useQueryClient } from "@tanstack/react-query"
import { InfiniteData } from "@tanstack/query-core"
import { saveGame } from "../redux/gameSlice"
import { saveScrolledGames } from "../redux/scrolledGamesSlice"
import { parseGameTags, parseGameType } from "../pages/api/lib/utils/misc"

interface IGameCardProps {
  game: IGame
  searchString: string
}

export default function GameCard({ game, searchString }: IGameCardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { id, name, gameType, provider, tags } = game

  const onClickGame = () => {
    // Save clicked game in Redux store
    dispatch(saveGame(game))

    // Get scrolledGames from React-Query cache
    const scrolledGames = queryClient.getQueryData([
      `games-search-${searchString}`,
    ]) as InfiniteData<IGame[]>

    // Save scrolled games in store
    dispatch(saveScrolledGames(scrolledGames))

    // Change url (NextJS shallow navigation)
    router.push(`/${id}`, undefined, { shallow: true })
  }

  return (
    <div id={id} onClick={onClickGame}>
      <div
        style={{ backgroundImage: `url(${game.image})` }}
        className="game-card-bg relative px-9 py-[21px] h-[231px] md:h-[231px]
          hover:translate-y-[5px] hover:scale-x-[102%] transition duration-100 ease-out"
        title={name}
      >
        <div
          className="absolute font-black italic top-[10.67%]
              w-[132px] right-[6.88%] h-[72px] text-white text-xl leading-6
              flex items-center overflow-hidden"
        >
          {name}
        </div>
        <div
          className="absolute top-[49.78%]
              w-[132px] right-[6.88%] text-[#DFDFDF] font-normal text-[10px] leading-4"
        >
          <div>{parseGameType(gameType)}</div>
          <div>by {provider}</div>
        </div>
        <div
          className="absolute top-[178px] w-[130px] h-[38px] pr-[5px] right-[6.88%]
          text-[#8B8B90] font-normal text-[10px] leading-4
          flex items-center"
        >
          <div>{parseGameTags(tags)}</div>
        </div>
      </div>
    </div>
  )
}

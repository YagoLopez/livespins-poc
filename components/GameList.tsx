import { IGame } from "../pages/api/lib/interfaces/IGame"
import GameCard from "./GameCard"
import { forwardRef, Ref } from "react"
import { InfiniteData } from "@tanstack/query-core"

interface IGameListProps {
  gameList: InfiniteData<IGame[]> | undefined
  inputSearchState: string
  loadMoreBtnRef: Ref<HTMLButtonElement>
  fetchNextPage: ({ pageParam }: { pageParam: number }) => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  classes: string
}

const GameList = forwardRef(
  (
    {
      gameList,
      inputSearchState,
      loadMoreBtnRef,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      classes,
    }: IGameListProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className={classes}>
        {gameList?.pages?.map((group: any) =>
          group.data?.map((game: IGame) => (
            <GameCard
              key={game.id}
              game={game}
              searchString={inputSearchState}
            />
          ))
        )}

        <button
          ref={loadMoreBtnRef}
          onClick={() => fetchNextPage({ pageParam: 10 })}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : null}
        </button>
      </div>
    )
  }
)

export default GameList

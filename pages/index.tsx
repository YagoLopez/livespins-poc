import type { GetServerSideProps, NextPage } from "next"
import { GamesRepository } from "./api/lib/repositories/games.repository"
import { useRepository } from "./api/lib/repositories/useRepository"
import React, { useEffect, useRef, useState } from "react"
import Error from "../components/Error"
import Loader from "../components/Loader"
import { RootState, useAppDispatch } from "../redux/store"
import { useSelector } from "react-redux"
import GameList from "../components/GameList"
import InputSearch from "../components/InputSearch"
import { saveScrolledGames } from "../redux/scrolledGamesSlice"
import { IGame } from "./api/lib/interfaces/IGame"
import { InfiniteData } from "@tanstack/query-core"
import HeadContent from "../components/HeadContent"
import Logo from "../components/Logo"
import UpArrowIcon from "../components/icons/UpArrowIcon"

const Lobby: NextPage = ({ search }: Record<string, string>) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const loadMoreBtnRef = useRef<HTMLButtonElement>(null)
  const gameListRef = useRef<HTMLDivElement>(null)
  const selectedGame = useSelector((state: RootState) => state.game)
  const scrolledGames = useSelector((state: RootState) => state.scrolledGames)
  const [inputSearchState, setInputSearchState] = useState(search)
  const gamesRepository = new GamesRepository()
  const { useSearchPaginated } = useRepository(gamesRepository)
  const dispatch = useAppDispatch()
  const [gameListScroll, setGameListScroll] = useState(0)

  const getInitialData = () =>
    scrolledGames?.pages?.length > 0 ? scrolledGames : undefined

  const scrollIntoViewport = (selectedGame: IGame): void => {
    const selectedGameDiv = document.getElementById(
      selectedGame.id
    ) as HTMLDivElement
    selectedGameDiv?.scrollIntoView()
  }

  const onClickUpArrowIcon = () => {
    gameListRef.current?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }

  const {
    data: gameList,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useSearchPaginated(inputSearchState, getInitialData())

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = search
      setInputSearchState(search)
    }
  }, [search])

  useEffect(() => {
    dispatch(saveScrolledGames(gameList as InfiniteData<IGame[]>))
  }, [gameList])

  useEffect(() => {
    scrollIntoViewport(selectedGame)
    if (!hasNextPage) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && fetchNextPage()),
      {
        root: null,
      }
    )
    const loadMoreBtnElement = loadMoreBtnRef.current
    if (!loadMoreBtnElement) return
    observer.observe(loadMoreBtnElement)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, fetchNextPage])

  gameListRef.current?.addEventListener("scroll", () => {
    setGameListScroll(gameListRef.current?.scrollTop || 0)
  })

  return (
    <>
      <div className="bg-black-200 h-[100vh]">
        <HeadContent />

        <Logo classes="flex justify-center md:w-[1190px] md:mx-auto md:block" />

        <InputSearch
          ref={inputRef}
          inputSearchState={inputSearchState}
          setInputSearchState={setInputSearchState}
          gameListRef={gameListRef}
          classes="flex justify-center md:w-[1190px] md:mx-auto md:block"
        />

        {isError && <Error error={error} />}

        {isFetching && <Loader />}

        <GameList
          ref={gameListRef}
          gameList={gameList}
          inputSearchState={inputSearchState}
          loadMoreBtnRef={loadMoreBtnRef}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          classes="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8
                      md:gap-[40px] md:w-[1190px] h-[771px] overflow-y-auto
                      overflow-x-hidden m-auto mt-[56px]"
        />
      </div>
      {gameListScroll > 0 && (
        <div
          className="fav-btn"
          title="Scroll to top"
          onClick={onClickUpArrowIcon}
        >
          <UpArrowIcon />
        </div>
      )}
    </>
  )
}

export default Lobby

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // Get "search" parameter from browser query string"
  // And pass it to page component as prop
  const { search } = query
  return {
    props: { search: !search ? "" : search },
  }
}

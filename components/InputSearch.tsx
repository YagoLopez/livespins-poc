import React, { ChangeEvent, FormEvent, forwardRef, RefObject } from "react"
import { useRouter } from "next/router"
import SearchIcon from "./icons/SearchIcon"
import ClearIcon from "./icons/ClearIcon"

interface InputSearchProps {
  inputSearchState: string
  setInputSearchState: Function
  gameListRef: RefObject<HTMLDivElement>
  classes: string
}

const InputSearch = forwardRef(
  (
    {
      inputSearchState,
      setInputSearchState,
      gameListRef,
      classes,
    }: InputSearchProps,
    ref: any
  ) => {
    const router = useRouter()

    const clearSearch = () => {
      setInputSearchState("")
      router.push("/", undefined, { shallow: false })
      gameListRef.current?.scrollTo(0, 0)
    }

    const onSearch = (e: FormEvent) => {
      e.preventDefault()
      const { value: searchString } = ref?.current as HTMLInputElement
      setInputSearchState(searchString)
      router.push(`/?search=${searchString}`, undefined, {
        shallow: false,
      })
      gameListRef.current?.scrollTo(0, 0)
    }

    const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { value: searchString } = e.target
      if (!searchString.length) clearSearch()
    }

    const onClearSearchBtn = () => {
      clearSearch()
      ref.current.value = ""
    }

    return (
      <form onSubmit={(e) => onSearch(e)} className={classes}>
        <label htmlFor="search">
          <div className="relative w-[350px] sm:w-[400px]">
            <input
              ref={ref}
              id="search"
              type="text"
              onChange={onChangeSearchInput}
              autoComplete="off"
              className="block p-[11px] pl-12 w-full text-md text-black bg-gray-50
              rounded-lg border border-gray-300"
              placeholder="Search Game (eg. Poker, Slots, Blackjack)"
            />
            <div
              className="flex absolute inset-y-0 left-0 items-center
              pl-[17px] pointer-events-none"
            >
              <SearchIcon />
            </div>
            {inputSearchState !== "" && (
              <div
                onClick={onClearSearchBtn}
                title="Clear Search"
                className="text-white absolute right-2.5 bottom-2.5
              hover:bg-gray-200 hover:cursor-pointer
              rounded-lg"
              >
                <ClearIcon />
              </div>
            )}
          </div>
        </label>
      </form>
    )
  }
)

export default InputSearch

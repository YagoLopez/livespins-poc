export default function isOnlySpaces(str: string): boolean {
  return str.trim().length === 0
}

export const parseGameTags = (gameTags: string[]): string => {
  const MAX_SHOWN = 3
  const gameTagsCopy = [...gameTags]
  if (gameTags.length > 3) {
    const totalTags = gameTags.length
    const restTags = totalTags - MAX_SHOWN
    gameTagsCopy.length = MAX_SHOWN // truncate array
    return `${gameTagsCopy
      .toLocaleString()
      .replace(/,/g, " • ")} • +${restTags} more`
  }
  return `${gameTagsCopy?.toLocaleString().replace(/,/g, " • ")}`
}

export const parseGameType = (gameType: string): string => {
  let res = ""
  const splittedStringCopy = [...gameType.split("_")]
  splittedStringCopy.forEach((str: string) => {
    str.charAt(0).toUpperCase()
    res += `${str.charAt(0).toUpperCase()}${str.slice(1)} `
  })
  return res
}

interface IMatchedOptions {
  ignoreCase?: boolean
  exactMatch?: boolean
}

/**
 * 是否匹配
 * @param keyword 关键字
 * @param wholeWord 完整的字符串
 * @param options 匹配选项
 * @field options.ignoreCase：是否忽略大小写，默认true
 * @field options.exactMatch：是否精确匹配，默认false
 * @returns 匹配结果，是否能够匹配上
 */
const isMatched = (keyword: string, wholeWord: string, options: IMatchedOptions = { ignoreCase: true, exactMatch: false }): boolean => {
  let isMatched = true

  if (!keyword || !keyword.trim()) {
    return true
  }

  keyword = keyword.trim()
  wholeWord = wholeWord.trim()

  if (options.ignoreCase) {
    keyword = keyword.toLowerCase()
    wholeWord = wholeWord.toLowerCase()
  }

  if (!options.exactMatch) {
    const keys = keyword.split('')
    // 遍历关键字的每个字符，若按序在整个字符串中能找到匹配，则认为其匹配
    keys.forEach((key) => {
      const curIndex = wholeWord.indexOf(key)
      if (curIndex > -1) {
        wholeWord = wholeWord.slice(curIndex + 1)
      } else {
        isMatched = false
      }
    })
  } else {
    isMatched = wholeWord.includes(keyword)
  }

  return isMatched
}

export default isMatched
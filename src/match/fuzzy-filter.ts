import isMatched  from './is-matched'

/**
 * 模糊过滤
 * @param keyword 关键字
 * @param words 需要根据关键字过滤的字符串集合
 * @param ignoreCase 是否忽略大小写，默认为true
 */
const fuzzyFilter = (keyword: string, words: Array<string>, ignoreCase = true): Array<string> => {
  if (!keyword || !keyword.trim()) {
    return words
  }
  return words.filter(word => isMatched(keyword, word, { ignoreCase }))
}

export default fuzzyFilter

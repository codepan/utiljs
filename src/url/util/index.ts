export const parseQueryString = (queryString: string): Record<string, unknown> => {
  const rawString = queryString.startsWith('?') ? queryString.substr(1) : queryString
  const paramEntries: string[] = rawString.split('&')
  const query = paramEntries.reduce((memo: unknown, entry) => {
    const [key, value] = entry.split('=')
    // eslint-disable-next-line no-param-reassign
    if (memo[key]) {
      Array.isArray(memo[key]) ? memo[key].push(value) : memo[key] = [memo[key], value]
    } else {
      memo[key] = value
    }
    return memo
  }, {})
  return query
}


export const setQuery = (url: string, query: Record<string, unknown>): string => {
  Object.entries(query).forEach(([key, value]) => {
    if (!url.includes('?')) {
      url += `?${key}=${value}`
    } else {
      if (url.endsWith('?')) {
        url += `${key}=${value}`
      } else {
        if (url.endsWith('&')) {
          url += `${key}=${value}`
        } else {
          url += `&${key}=${value}`
        }
      }
    }
  })
  return url
}

export const formatHref = (href: string): string => {
  const hasProtocolStart = href.indexOf('//') >= 0
  const pathnameStartIndex = href.indexOf('/', href.indexOf('//') + 2)

  if (!hasProtocolStart || pathnameStartIndex !== -1) return href

  if (href.includes('?')) {
    const searchIndex = href.indexOf('?')
    return `${href.substring(0, searchIndex)}/${href.substring(searchIndex)}`
  }

  if (href.includes('#')) {
    const hashIndex = href.indexOf('#')
    return `${href.substring(0, hashIndex)}/${href.substring(hashIndex)}`
  }

  return `${href}/`
}

export const isValid = (href: string): boolean => {
  const regExp = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.]+[-A-Za-z0-9+&@#/%=~_|]/

  return regExp.test(href)
}

export const typeChecker = {
  isObject: (target: unknown): boolean => Object.prototype.toString.call(target) === '[object Object]',
  isBoolean: (target: unknown): boolean => typeof target === 'boolean',
  isString: (target: unknown): boolean => typeof target === 'string',
  isNumber: (target: unknown): boolean => typeof target === 'number',
  isRegExp: (target: unknown): boolean => typeof target === 'object' && target instanceof RegExp,
  isFunction: (target: unknown): boolean => typeof target === 'function',
  isUndefined: (target: unknown): boolean => typeof target === 'undefined',
}

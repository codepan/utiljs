import { RULES } from '../constants'
import { parseQueryString, formatHref, typeChecker } from '../util'

interface ILocation {
  protocol: string
  host: string
  hostname: string
  port: string
  origin: string
  path: string
  pathname: string
  href: string
  search: string
  query: string | Record<string, unknown>
  hash: string
  fragment: string
}
type WithoutKey = 'protocol' | 'origin' | 'condition' | 'hash'

type HasQueryFun = (value: string, key: string, query: Record<string, unknown>) => boolean

class URL {
  private href: string
  /**
   * 添加查询参数重名处理规则
   * @field KEEP 保持原样，即放弃本次重复添加的参数，保留原有的参数
   * @field REPEAT 允许重复添加，全部保留住
   * @field REPLACE 替换，新值替换掉旧值
   */
  public static readonly RULES = RULES
  public constructor(href: string) {
    this.href = formatHref(href)
  }
  public setHref(href: string): URL {
    this.href = formatHref(href)
    return this
  }
  public getHref(): string {
    return this.href
  }
  /**
   * 设置协议
   * @param protocol 协议
   * @returns URL实例
   * @example
   * const url = new URL('http://example.com/test/hello.html')
   * url.setProtocol('https') // 设置协议为https
   * url.getHref() // 'https://example.com/test/hello.html'
   * url.setProtocol('') // 设置相对协议
   * url.getHref() // '//example.com/test/hello.html'
   */
  public setProtocol(protocol: string): URL {
    if (typeof protocol === 'undefined') return this
    let href = this.getHref()
    href = href.replace(this.getProtocol(), protocol)
    this.setHref(protocol === '' ? href.substr(1) : href)
    return this
  }
  /**
   * 获取协议
   * @returns 协议
   */
  public getProtocol(): string {
    const url = this.getHref()
    return url.substring(0, url.indexOf('//') - 1)
  }
  /**
   * 设置查询字符串
   * @description 传入空字符串，可实现全部清空查询字符串功能
   * @param search 查询字符串
   * @returns URL实例
   */
  public setSearch(search: string): URL {
    let href = this.getHref()
    const originSearch = this.getSearch()
    if (search) {
      search = search.startsWith('?') ? search : `?${search}`
    }

    if (!originSearch) return this.setHref(`${href}${search}`)

    href = href.replace(originSearch, search)
    return this.setHref(href)
  }
  /**
   * 获取查询字符串，包含?
   * @returns 查询字符串，包含?
   */
  public getSearch(): string {
    const url = this.getHref()
    const hasHash = url.includes('#')
    const hasSearch = url.includes('?')

    if (!hasSearch) return ''
    if (hasHash) return url.substring(url.indexOf('?'), url.indexOf('#'))
    return url.substring(url.indexOf('?'))
  }
  /**
   * 设置查询字符串
   * @description 该方法与setSearch表现行为完全一致
   * @param queryString 查询字符串
   * @returns URL实例
   */
  public setQuery(queryString: string): URL {
    return this.setSearch(queryString)
  }
  /**
   * 获取查询字符串或解析后的对象
   * @param isParseQueryString 是否解析，默认为true
   * @returns
   * string 查询字符串
   * object 解析后的对象
   */
  public getQuery(isParseQueryString = true): string | Record<string, unknown> {
    const url = this.getHref()
    const startIndex = url.indexOf('?')
    const hashIndex = url.indexOf('#')

    let queryString = ''

    if (startIndex === -1) return isParseQueryString ? {} : ''

    if (hashIndex === -1) {
      queryString = url.substr(startIndex + 1)
    } else if (startIndex < hashIndex) {
      queryString = url.substring(startIndex + 1, hashIndex)
    }

    if (!queryString) return isParseQueryString ? {} : ''
    return isParseQueryString ? parseQueryString(queryString) : queryString
  }
  /**
   * 设置主机
   * @param host 主机
   * @returns URL实例
   */
  public setHost(host: string): URL {
    let href = this.getHref()
    href = href.replace(this.getHost(), host)
    return this.setHref(href)
  }
  /**
   * 获取主机，包含端口
   * @returns 主机
   */
  public getHost(): string {
    const href = this.getHref()
    if (!href.includes('//')) return ''
    const startIndex = href.indexOf('//') + 2
    const endIndex = href.indexOf('/', startIndex)
    if (endIndex === -1) return href.substring(startIndex)
    return href.substring(startIndex, endIndex)
  }
  /**
   * 设置主机名
   * @param hostname 主机名
   */
  public setHostname(hostname: string): URL {
    let href = this.getHref()
    href = href.startsWith('/') ? href : `/${href}`
    href = href.replace(this.getHostname(), hostname)
    return this.setHref(href)
  }
  /**
   * 获取主机名，不包含端口
   * @returns 主机名
   * http://www.test.com:8080/user
   */
  public getHostname(): string {
    const host = this.getHost()
    if (!host) return ''
    if (!host.includes(':')) return host
    return host.split(':')[0]
  }
  /**
   * 设置源
   * @param origin 源
   * @returns URL实例
   */
  public setOrigin(origin: string): URL {
    let href = this.getHref()
    href = href.replace(this.getOrigin(), origin)
    return this.setHref(href)
  }
  /**
   * 获取源
   * @returns 源
   */
  public getOrigin(): string {
    const [protocol, host] = [this.getProtocol(), this.getHost()]
    if (!host) return ''
    if (!protocol) return host
    return `${protocol}://${host}`
  }
  /**
   * 设置端口
   * @param port 端口
   * @returns URL实例
   */
  public setPort(port: string): URL {
    let href = this.getHref()
    href = href.replace(this.getPort(), port)
    return this.setHref(href)
  }
  /**
   * 获取端口
   * @returns 端口
   */
  public getPort(): string {
    const host = this.getHost()
    if (!host || !host.includes(':')) return ''
    return host.split(':')[1]
  }
  /**
   * 设置路径名
   * @param pathname 路径名
   * @returns URL实例
   */
  public setPathname(pathname: string): URL {
    let href = this.getHref()
    href = href.replace(this.getPathname(), pathname)
    return this.setHref(href)
  }
  /**
   * 获取路径名
   * @returns 路径名
   */
  public getPathname(): string {
    const url = this.getHref()
    const origin = this.getOrigin()
    const startIndex = origin.length
    const endIndex = url.indexOf('?') || url.indexOf('#')

    if (startIndex === -1) return '/'
    if (endIndex === -1) return url.substring(startIndex)
    return url.substring(startIndex, endIndex)
  }
  /**
   * 设置哈希
   * @param hash 哈希
   * @returns URL实例
   */
  public setHash(hash: string): URL {
    let href = this.getHref()
    hash = hash.startsWith('#') ? hash : `#${hash}`
    if (!this.getHash()) {
      return this.setHref(`${href}${hash}`)
    }
    href = href.replace(this.getHash(), hash)
    return this.setHref(href)
  }
  /**
   * 获取哈希
   * @returns 哈希
   */
  public getHash(): string {
    const url = this.getHref()
    const hasHash = url.includes('#')
    return hasHash ? url.substring(url.indexOf('#')) : ''
  }
  /**
   * 设置片段
   * @param fragment 片段
   * @returns URL实例
   */
  public setFragment(fragment: string): URL {
    return this.setHash(fragment)
  }
  /**
   * 获取片段，其实就是：不包含#的哈希
   * @returns 片段
   */
  public getFragment(): string {
    return this.getHash().substring(1)
  }
  /**
   * 设置条件
   * @param condition 条件
   * @returns URL实例
   * @description 条件是指：包含search和hash的字符串
   */
  public setCondition(condition: string): URL {
    const href = this.getHref()
    return this.setHref(href.replace(this.getSearch() + this.getHash(), condition))
  }
  /**
   * 获取条件
   * @returns 条件
   * @description 条件是指：包含search和hash的字符串
   */
  public getCondition(): string {
    return this.getSearch() + this.getHash()
  }
  /**
   * 设置路径
   * @param path 路径
   * @returns URL实例
   * @description 路径是指：包含了pathname、search和hash
   */
  public setPath(path: string): URL {
    const origin = this.getOrigin()
    if (!origin) return this.setHref(path)
    return this.setHref(`${origin}${path}`)
  }
  /**
   * 获取路径
   * @returns 路径
   * @description 路径是指：包含了pathname、search和hash
   */
  public getPath(): string {
    return this.getPathname() + this.getSearch() + this.getHash()
  }
  /**
   * 获取除去通过 withoutKey 参数指定的其余部分
   * @param withoutKey 欲排除的部分，类型为WithoutKey，字符串类型，有protocol、origin、condition、hash四种取值
   * @returns 除去 withoutKey 参数指定的其余部分
   * @example
   * const url = new URL('https://www.test.com/user/profile?name=zhang#test')
   * url.getPartsWithout('condition') // https://www.test.com/user/profile
   */
  public getPartOfWithout(withoutKey: WithoutKey): string {
    const href = this.getHref()
    switch (withoutKey) {
      case 'protocol': return href.replace(`${this.getProtocol()}:`, '')
      case 'origin': return href.replace(this.getOrigin(), '')
      case 'condition': return href.replace(this.getCondition(), '')
      case 'hash': return href.replace(this.getHash(), '')
    }
  }
  /**
   * 解析整个url
   * @param isParseQueryString 是否解析查询字符串，默认为true
   * @returns 对象
   */
  public parse(isParseQueryString = true): ILocation {
    return {
      protocol: this.getProtocol(),
      host: this.getHost(),
      hostname: this.getHostname(),
      port: this.getPort(),
      origin: this.getOrigin(),
      path: this.getPath(),
      pathname: this.getPathname(),
      href: this.getHref(),
      search: this.getSearch(),
      query: this.getQuery(isParseQueryString),
      hash: this.getHash(),
      fragment: this.getFragment(),
    }
  }
  /**
   * 添加查询参数
   * @param key 查询参数键/查询参数对象
   * @param value 查询参数值，可选
   * @param rule 参数重名处理规则，可选，取值请调用 URL.RULES.XXX，默认为replace
   * @returns URL实例
   */
  public addQuery(key: string | Record<string, unknown>, value?: string, rule: string = RULES.REPLACE): URL {
    const url = this.getHref()
    let query = this.getQuery()
    const search = this.getSearch()
    const hash = this.getHash()
    let [left, right] = ['', '']
    if (search) {
      [left, right] = url.split(search)
    } else {
      if (hash) {
        [left, right] = [url.split(hash)[0], hash]
      } else {
        [left, right] = [url, '']
      }
    }
    if (typeChecker.isObject(key)) {
      rule = value || rule
      switch (rule) {
        case RULES.REPLACE:
          query = {
            ...query as Record<string, unknown>,
            ...key as Record<string, unknown>,
          }
          break
        case RULES.REPEAT:
          Object.entries(key).forEach(([key, value]) => {
            if (!query[key]) {
              query[key] = value
            } else {
              if (Array.isArray(query[key])) {
                Array.isArray(value) ? query[key].push(...value) : query[key].push(value)
              } else {
                Array.isArray(value) ? query[key] = [query[key], ...value] : query[key] = [query[key], value]
              }
            }
          })
          break
        case RULES.KEEP:
          query = {
            ...key as Record<string, unknown>,
            ...query as Record<string, unknown>,
          }
      }
    } else {
      key = key as string
      switch (rule) {
        case RULES.REPLACE:
          query[key] = value
          break
        case RULES.REPEAT:
          query[key] ? query[key] = [query[key], value] : query[key] = value
          break
        case RULES.KEEP:
          if (!query[key]) query[key] = value
      }
    }

    const queryString = URL.queryStringify(query as Record<string, unknown>)
    return this.setHref(`${left}?${queryString}${right}`)
  }
  /**
   * 移除查询参数
   * @param keyOrKeys 欲删除的查询参数键/键数组/键值对
   * @returns URL实例
   */
  public removeQuery(keyOrKeysOrKeyValue: string | string[] | Record<string, unknown>, value?: string): URL {
    const url = this.getHref()
    const query = this.getQuery()
    const search = this.getSearch()
    const [left, right] = url.split(search)

    if (typeChecker.isObject(keyOrKeysOrKeyValue)) {
      Object.entries(keyOrKeysOrKeyValue).forEach(([key, value]) => {
        const targetValue = query[key]
        if (targetValue) {
          if (Array.isArray(targetValue)) {
            targetValue.splice(targetValue.indexOf(value), 1)
          } else {
            delete query[key]
          }
        }
      })
    } else if (Array.isArray(keyOrKeysOrKeyValue)) {
      keyOrKeysOrKeyValue.forEach(key => delete query[key])
    } else {
      const key = keyOrKeysOrKeyValue as string
      const targetValue = query[key]

      if (!value) {
        delete query[key]
      } else {
        if (!targetValue) {
          delete query[key]
        } else {
          if (Array.isArray(targetValue)) {
            targetValue.includes(value) && targetValue.splice(targetValue.indexOf(value), 1)
          } else {
            targetValue === value && delete query[key]
          }
        }
      }
    }

    const queryString = URL.queryStringify(query as Record<string, unknown>)
    if (!queryString) return this.setHref(`${left}${right}`)
    return this.setHref(`${left}?${queryString}${right}`)
  }
  public hasQuery(key: string | RegExp, value?: boolean | string | number | RegExp): boolean
  public hasQuery(key: string, value?: Array<string | number> | HasQueryFun): boolean
  public hasQuery(
    key: string | RegExp,
    value?: string | number | Array<string | number> | RegExp | boolean | HasQueryFun
  ): boolean {
    const query = this.getQuery()

    if (typeChecker.isUndefined(value)) {
      if (typeChecker.isRegExp(key)) {
        return !!Object.keys(query).find(queryKey => (key as RegExp).test(queryKey))
      }
      return query.hasOwnProperty(key as string)
    }

    if (typeChecker.isBoolean(value)) {
      value = value as boolean
      if (typeChecker.isRegExp(key)) {
        return !!Object.entries(query).find(([queryKey, queryValue]) => (key as RegExp).test(queryKey) && queryValue)
      }
      key = key as string
      return value ? Boolean(query[key]) : query.hasOwnProperty(key)
    }

    if (typeChecker.isString(value) || typeChecker.isNumber(value)) {
      value += ''
      if (typeChecker.isRegExp(key)) {
        return !!Object.keys(query).find(queryKey => (key as RegExp).test(queryKey))
      }

      const queryValue = query[key as string]
      const queryValues = Array.isArray(queryValue) ? queryValue : [queryValue]
      return queryValues.includes(value)
    }

    if (typeChecker.isRegExp(value)) {
      const isValueMatched = (queryValue) => {
        let valueMatched = false
        if (Array.isArray(queryValue)) {
          valueMatched = !!queryValue.find(item => (value as RegExp).test(item))
        } else {
          valueMatched = (value as RegExp).test(queryValue as string)
        }
        return valueMatched
      }
      if (typeChecker.isRegExp(key)) {
        return !!Object.entries(query).find(([queryKey, queryValue]) => (key as RegExp).test(queryKey) && isValueMatched(queryValue))
      }

      return query.hasOwnProperty(key as string) && isValueMatched(query[key as string])
    }

    if (Array.isArray(value)) {
      const queryValue = query[key as string]
      if (!queryValue || !Array.isArray(queryValue)) return false
      return value.every(item => queryValue.includes(String(item)))
    }

    if (typeChecker.isFunction(value)) {
      key = key as string
      value = value as HasQueryFun
      return value(query[key], key, query as Record<string, unknown>)
    }

    return false
  }
  /**
   * 解析url地址
   * @param href 被解析字符串
   * @param isParseQueryString 是否解析查询字符串，默认为true
   * @returns
   */
  public static parse(href: string, isParseQueryString = true): ILocation {
    return new URL(href).parse(isParseQueryString)
  }

  /**
   * 解析查询字符串
   * @param queryString 查询字符串
   */
  public static parseQuery(queryString: string): Record<string, unknown> {
    return parseQueryString(queryString)
  }

  /**
   * 序列化查询字符串对象
   * @param query 查询字符串对象
   * @returns 查询字符串
   */
  public static queryStringify(query: Record<string, unknown>): string {
    const queryStringList = Object.entries(query).reduce((memo: string[], [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => memo.push(`${key}=${val}`))
      } else {
        memo.push(`${key}=${value}`)
      }
      return memo
    }, [])
    return queryStringList.join('&')
  }
  /**
   * 连接url各项组成部分，组成一个完整的url
   * @param parts url各项组成部分
   * @description 可以任意传入url任何组成部分
   * @description 当既要传入 查询字符串/查询对象，又要传入 hash 时，hash 为最后一个参数，查询字符串/查询对象 为倒数第二个参数
   * @description 否则，查询字符串/查询对象 或 hash 为最后一个参数
   */
  public static join(...parts: (string|Record<string, unknown>)[]): string {
    if (!parts || !parts.length) return ''
    if (parts.length === 1) {
      const [part] = parts
      if (typeChecker.isObject(part)) {
        return URL.queryStringify(part as Record<string, unknown>)
      }
      return part as string
    }

    if (parts.length === 2) {
      const [part1, part2] = parts
      if (typeChecker.isObject(part1)) {
        return `${URL.queryStringify(part1 as Record<string, unknown>)}${part2}`
      }

      if (typeChecker.isObject(part2)) {
        return new URL(part1 as string)
          .addQuery(part2)
          .getHref()
      }

      return `${part1}${part2}`
    }

    const likeHash = parts.pop()
    const likeQuery = parts.pop()

    if (typeChecker.isObject(likeHash)) {
      const baseURL = `${parts.join('')}${likeQuery}`
      return new URL(baseURL)
        .addQuery(likeHash)
        .getHref()
    }

    if (typeChecker.isObject(likeQuery)) {
      const baseURL = parts.join('')
      return new URL(baseURL)
        .addQuery(likeQuery)
        .setHash(likeHash as string)
        .getHref()
    }

    return `${parts.join('')}${likeQuery}${likeHash}`
  }
}

export default URL

import { upperFirst, lowerFirst } from '../string'

const isObject = (target: unknown): boolean => Object.prototype.toString.call(target) === '[object Object]'

type CaseType = 'upperCase' | 'lowerCase'
interface ConvertOptions {
  caseType?: CaseType,
  deep?: boolean,
  exclude?: string | Array<string>
}

/**
 * 转换对象的key或数组中对象的key的首字母的大小写
 * @param source 需要转换的内容，可以是对象，也可以是数组，或其它任意类型
 * @param options 转换时的选项
 * 
 * * caseType 指定转换为大写还是小写，大写：'upperCase' 小写：'lowerCase'
 * * deep 是否深度递归转换，默认为false
 * * exclude 不转换哪些对象key
 */
function convertFirstLetterCaseOfKey(source: unknown, options: ConvertOptions = {}): unknown {
  const { caseType = 'upperCase', deep = false, exclude = [] } = options
  if (Array.isArray(source)) {
    return source.map(item => convertFirstLetterCaseOfKey(item, options)) 
  }

  if (isObject(source)) {
    return Object
    .entries(source as Record<string, unknown>)
    .reduce((memo, next) => {
      const [key, value] = next
      const excludes = Array.isArray(exclude) ? exclude : [exclude]
      if (excludes.includes(key)) {
        memo[key] = value
      } else {
        memo[caseType === 'upperCase' ? upperFirst(key) : lowerFirst(key)] = deep ? convertFirstLetterCaseOfKey(value, options) : value
      }
      return memo
    }, {})
  }
  return source
}

export {
  convertFirstLetterCaseOfKey
}

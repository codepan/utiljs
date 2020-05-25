/**
 * 中划线’-‘后的字符转大写
 * @param {string} source 需转换的字符串
 */
function hyphenToCamel (source) {
  let items = source.split('-')
  items = items.map(item => `${item.charAt(0).toUpperCase()}${item.substr(1)}`)
  return items.join('')
}

/**
 * hyphenToCamel的反函数，将大写字符转为小写并以中划线’-‘分开
 * @param {string} source 需转换的字符串
 */
function camelToHyphen (source) {
  return source.replace(/([A-Z])/g, (match, $1, index) => {
    if (index === 0) return $1.toLowerCase() 
    return `-${$1.toLowerCase()}`
  })
}

/**
 * 中划线'-'转下划线'_'
 * @param {string} source 
 */
function hyphenToUnderline (source) {
  return source.replace(/\-/g, '_')
}

/**
 * 下划线'_'转中划线'-'
 * @param {string} source 
 */
function underlineToHyphen (source) {
  return source.replace(/_/g, '-')
}

/**
 * 首字母小写
 * @param {string} source 
 */
function lowerFirst (source) {
  return `${source.charAt(0).toLowerCase()}${source.substr(1)}`
}

/**
 * 首字母大写
 * @param {string} source 
 */
function upperFirst (source) {
  return `${source.charAt(0).toUpperCase()}${source.substr(1)}`
}

export {
  hyphenToCamel,
  camelToHyphen,
  hyphenToUnderline,
  underlineToHyphen,
  lowerFirst,
  upperFirst
}
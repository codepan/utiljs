/**
 * 中划线’-‘转驼峰
 * @param {string} source 需转换的字符串
 */
function hyphenToCamel (source: string): string {
  return source.replace(/-(\w)/g, (match, $1) => $1.toUpperCase())
}

/**
 * 下划线'_'转驼峰
 * @param {string} source 需转换的字符串
 */
function underlineToCamel (source: string): string {
  return source.replace(/_(\w)/g, (match, $1) => $1.toUpperCase())
}

/**
 * 驼峰转中划线’-‘
 * @param {string} source 需转换的字符串
 */
function camelToHyphen (source: string): string {
  return source.replace(/([A-Z])/g, (match, $1, index) => {
    if (index === 0) return $1.toLowerCase() 
    return `-${$1.toLowerCase()}`
  })
}

/**
 * 驼峰转下划线’_‘
 * @param {string} source 需转换的字符串
 */
function camelToUnderline (source: string): string {
  return source.replace(/([A-Z])/g, (match, $1, index) => {
    if (index === 0) return $1.toLowerCase() 
    return `_${$1.toLowerCase()}`
  })
}


/**
 * 中划线'-'转下划线'_'
 * @param {string} source 
 */
function hyphenToUnderline (source: string): string {
  return source.replace(/\-/g, '_')
}

/**
 * 下划线'_'转中划线'-'
 * @param {string} source 
 */
function underlineToHyphen (source: string): string {
  return source.replace(/_/g, '-')
}

/**
 * 首字母小写
 * @param {string} source 
 */
function lowerFirst (source: string): string {
  return `${source.charAt(0).toLowerCase()}${source.substr(1)}`
}

/**
 * 首字母大写
 * @param {string} source 
 */
function upperFirst (source: string): string {
  return `${source.charAt(0).toUpperCase()}${source.substr(1)}`
}

export {
  hyphenToCamel,
  underlineToCamel,
  camelToHyphen,
  camelToUnderline,
  hyphenToUnderline,
  underlineToHyphen,
  lowerFirst,
  upperFirst
}
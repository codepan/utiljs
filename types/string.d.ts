export namespace string {
  /**
   * 中划线’-‘后的字符转大写
   * @param {string} source 需转换的字符串
   */
  function hyphenToCamel(source: string): string

  /**
   * hyphenToCamel的反函数，将大写字符转为小写并以中划线’-‘分开
   * @param {string} source 需转换的字符串
   */
  function camelToHyphen (source: string): string

  /**
   * 中划线'-'转下划线'_'
   * @param {string} source 需转换的字符串
   */
  function hyphenToUnderline (source: string): string

  /**
   * 下划线'_'转中划线'-'
   * @param {string} source 需转换的字符串
   */
  function underlineToHyphen (source: string): string

  /**
   * 首字母小写
   * @param {string} source 需转换的字符串
   */
  function lowerFirst (source: string): string

  /**
   * 首字母大写
   * @param {string} source 需转换的字符串
   */
  function upperFirst (source: string): string
}
declare namespace utiljs {
  namespace string {
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
     * @param {string} source 
     */
    function upperFirst (source: string): string
  }

  namespace date {
    /**
     * 格式化日期
     * @param date 需格式化的日期，可以为日期对象，也可以为Date构造函数能接收的任何有效参数
     * @param pattern 格式化模式：默认为"yyyy年MM月dd日 hh时mm分ss秒"
     * 
     * 模式占位符共计七个：y/M/d/w/h/m/s，其中y代表年；M代表月；d代表日；w代表星期；h代表时；m代表分；s代表秒
     */
    function format(date: string | Date | number, pattern?: string): string

    /**
     * 比较两个日期
     * 
     * date1 = date2 return 0
     * 
     * date1 > date2 return 1
     * 
     * date1 < date2 return -1
     * @param {*} date1 第一个日期
     * @param {*} date2 第二个日期
     */
    function compare (date1:  string | Date | number, date2:  string | Date | number): number

    /**
     * 计算两个日期之间的天数
     * @param date1 日期一
     * @param date2 日期二
     */
    function countDays (date1: string | Date | number, date2: string | Date | number): number

    /**
     * 是否是闰年
     * @param {*} year 年份
     */
    function isLeapYear (year: number): boolean

    /**
     * 获取某月的天数
     * @param {*} month 月份，从1开始，取值为1~12
     * @param {*} year 年份，可选，用于判断是否为闰年，默认为当前年
     */
    function getDaysOfMonth (month: number, year?: number): number

    /**
     * 获取昨天日期
     * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
     */
    function getYesterday (pattern?: string): Date | string

    /**
     * 获取明天日期
     * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
     */
    function getTomorrow (pattern?: string): Date | string
  }
}

declare module '@codepan/utiljs' {
  export as namespace utiljs
  export = utiljs
}
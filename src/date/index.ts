import { defaultFormatPattern, patternRegExp } from './constants'
import { createDateInstance, paddingLeftZero } from './utils'
import { LikeDate } from './model'

/**
 * 
 * @param date 将要格式化的日期
 * @param pattern 格式化模式，默认为：'yyyy年MM月dd日 hh时mm分ss秒'
 * @example
 * 格式化当前日期 format('')或format(undefined)或format(null)
 * 传入时间戳 format(1607000082114)
 */
function format (date: LikeDate, pattern: string = defaultFormatPattern): string {
  const dateInstance = createDateInstance(date)
  console.log(dateInstance)
  if (!dateInstance) {
    return ''
  }
  
  if (typeof pattern !== 'string') {
    pattern = defaultFormatPattern
  }

  return pattern.replace(patternRegExp, (match, $1): string => {
    const length = $1.length
    switch ($1.charAt(0)) {
      case 'y':
        const year = dateInstance.getFullYear().toString()
        return year.substr(year.length - length)
      case 'M': return paddingLeftZero(dateInstance.getMonth() + 1, length)
      case 'd': return paddingLeftZero(dateInstance.getDate(), length)
      case 'w': return String(dateInstance.getDay() + 1)
      case 'h': return paddingLeftZero(dateInstance.getHours(), length)
      case 'm': return paddingLeftZero(dateInstance.getMinutes(), length)
      case 's': return paddingLeftZero(dateInstance.getSeconds(), length)
    }
  })
}

/**
 * 比较两个日期
 * date1 = date2 return 0
 * date1 > date2 return 1
 * date1 < date2 return -1
 * @param {*} date1 日期一
 * @param {*} date2 日期二
 */
function compare (date1: LikeDate, date2: LikeDate): number {
  const firstTimestamp = createDateInstance(date1).getTime()
  const secondTimestamp = createDateInstance(date2).getTime()

  if (firstTimestamp - secondTimestamp === 0) {
    return 0
  }

  return firstTimestamp - secondTimestamp > 0 ? 1 : -1
}

/**
 * 计算2日期之间的天数
 * @param date1 日期一
 * @param date2 日期二
 */
function countDays (date1: LikeDate, date2: LikeDate): number {
  return (createDateInstance(date1).getTime() - createDateInstance(date2).getTime()) / (24 * 60 * 60 * 1000)
}

/**
 * 是否是闰年
 * @param {*} year 年份
 */
 function isLeapYear (year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
/**
 * 获取某月的天数
 * @param {*} month 月份，从1开始，取值为1~12
 * @param {*} year 年份，可选，用于判断是否为闰年，默认为当前年
 */
function getDaysOfMonth (month: number, year = new Date().getFullYear()): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return days[month - 1]
}

/**
 * 获取昨天日期
 * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
 */
function getYesterday (pattern?: string): string | Date {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  if (pattern) {
    return format(date, pattern)
  }

  return date
}

/**
 * 获取明天日期
 * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
 */
function getTomorrow (pattern?: string): string | Date {
  const date = new Date()
  date.setDate(date.getDate() + 1)

  if (pattern) {
    return format(date, pattern)
  }

  return date
}

export {
  format,
  compare,
  countDays,
  isLeapYear,
  getDaysOfMonth,
  getYesterday,
  getTomorrow
}
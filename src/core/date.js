const defaultPattern = 'yyyy年MM月dd日 hh时mm分ss秒'
const regExp = /([yMdwhms]+)/g
const paddingLeftZero = (str, length) => {
  str += ''
  return length === 2 ? `00${str}`.substr(str.length) : str
}

const createDate = date => {
  if (!date) {
    return null
  }

  if (typeof date === 'string') {
    // safari 中不支持中划线-格式的年月日格式，但/兼容性很好
    date = date.replace('-', '/')
    date = new Date(date)
  }

  if (typeof date === 'number') {
    date = new Date(date)
  }

  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) {
      return null
    }
  }

  return date
}
function format (date, pattern = defaultPattern) {
  date = createDate(date)
  if (!date) {
    return
  }
  
  if (typeof pattern !== 'string') {
    pattern = defaultPattern
  }

  return pattern.replace(regExp, (match, $1) => {
    const length = $1.length
    switch ($1.charAt(0)) {
      case 'y':
        const year = date.getFullYear().toString()
        return year.substr(year.length - length)
      case 'M': return paddingLeftZero(date.getMonth() + 1, length)
      case 'd': return paddingLeftZero(date.getDate(), length)
      case 'w': return date.getDay() + 1
      case 'h': return paddingLeftZero(date.getHours(), length)
      case 'm': return paddingLeftZero(date.getMinutes(), length)
      case 's': return paddingLeftZero(date.getSeconds(), length)
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
function compare (date1, date2) {
  date1 = createDate(date1)
  date2 = createDate(date2)
  const firstTimestamp = date1.getTime()
  const secondTimestamp = date2.getTime()

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
function countDays (date1, date2) {
  date1 = createDate(date1)
  date2 = createDate(date2)

  return (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)
}

/**
 * 是否是闰年
 * @param {*} year 年份
 */
 function isLeapYear (year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
/**
 * 获取某月的天数
 * @param {*} month 月份，从1开始，取值为1~12
 * @param {*} year 年份，可选，用于判断是否为闰年，默认为当前年
 */
function getDaysOfMonth (month, year = new Date().getFullYear()) {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return days[month - 1]
}

/**
 * 获取昨天日期
 * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
 */
function getYesterday (pattern) {
  let date = new Date()
  date.setDate(date.getDate() - 1)

  if (pattern) {
    date = format(date, pattern)
  }

  return date
}

/**
 * 获取明天日期
 * @param {*} pattern 格式化模式，可选，形式同format函数第二个参数，不传则返回日期对象
 */
function getTomorrow (pattern) {
  let date = new Date()
  date.setDate(date.getDate() + 1)

  if (pattern) {
    date = format(date, pattern)
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
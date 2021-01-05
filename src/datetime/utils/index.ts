import { LikeDate } from '../model'

const paddingLeftZero = (str: string | number, length: number): string => {
  str += ''
  return length === 2 ? `00${str}`.substr((str as string).length) : (str as string)
}

const createDateInstance = (date?: LikeDate): null | Date => {
  if (!date) {
    return new Date()
  }

  if (typeof date === 'string') {
    // safari 中不支持中划线-格式的年月日格式，但兼容性很好
    date = date.replace('-', '/')
    date = new Date(date as string)
  }

  if (typeof date === 'number') {
    date = new Date(date)
  }

  if (date instanceof Date) {
    // 处理 Invalid Date 的情况
    if (Number.isNaN(date.getTime())) {
      return null
    }
  }

  return date as Date
}

export {
  paddingLeftZero,
  createDateInstance
}
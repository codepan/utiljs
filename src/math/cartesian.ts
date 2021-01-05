/**
 * 计算任意多个数组的笛卡尔积
 * @param items 任意多个数组
 */
const cartesian = (...items: Array<Array<unknown>>): Array<unknown> => {
  if (!items || !items.length) return []
  if (items.length === 1) return items[0]
  return Array.prototype.reduce.call(items, (memo, next) =>{
    const ret = []
    memo.forEach(a => {
      next.forEach(b => {
        ret.push(a.concat([b]))
      })
    })
   return ret
  }, [[]])
}

/**
 * 计算二维数组的笛卡尔积
 * @param array 二维数组
 */
const multiCartesian = (array: Array<Array<unknown>>): Array<unknown> => cartesian(...array)

export {
  cartesian,
  multiCartesian
}
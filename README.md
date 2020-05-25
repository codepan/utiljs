**hyphenToCamel**

```js
/**
 * 中划线’-‘后的字符转大写
 * @param {*} str 
 */
function hyphenToCamel (str) {
  let items = str.split('-')
  items = items.map(item => `${item.charAt(0).toUpperCase()}${item.substr(1)}`)
  return items.join('')
}

const str = 'hello-world'
console.log(hyphenToCamel(str)) // HelloWorld
```

**camelToHyphen**

```js
/**
 * hyphenToCamel的反函数，将大写字符转为小写并以中划线’-‘分开
 * @param {*} str 
 */
function camelToHyphen (str) {
  return str.replace(/([A-Z])/g, (match, $1, index) => {
    if (index === 0) return $1.toLowerCase() 
    return `-${$1.toLowerCase()}`
  })
}

const str = 'HiMaMM'
console.log(camelToHyphen(str)) // hi-ma-m-m
```

**hyphenToUnderline**

```js
/**
 * 中划线'-'转下划线'_'
 * @param {*} str 
 */
function hyphenToUnderline (str) {
  return str.replace(/\-/g, '_')
}

const str = 'h-e-l-l-o'
console.log(hyphenToUnderline(str)) // h_e_l_l_o
```

**underlineToHyphen**
```js
/**
 * 下划线'_'转中划线'-'
 * @param {*} str 
 */
function underlineToHyphen (str) {
  return str.replace(/_/g, '-')
}

const str = 'h_e_l_l_o'
console.log(underlineToHyphen(str)) // h-e-l-l-o
```


**lowerFirst**

```js
/**
 * 首字母小写
 * @param {*} str 
 */
function lowerFirst (str) {
  return `${str.charAt(0).toLowerCase()}${str.substr(1)}`
}

const str = 'Hello'
console.log(lowerFirst(str)) // hello
```

**upperFirst**

```js
/**
 * 首字母大写
 * @param {*} str 
 */
function upperFirst (str) {
  return `${str.charAt(0).toUpperCase()}${str.substr(1)}`
}

const str = 'hello'
console.log(upperFirst(str)) // Hello
```


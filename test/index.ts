import { URL, string, datetime, object, math, match } from '../src'

console.log(object.convertFirstLetterCaseOfKey({name: 'd', age: 2}))
console.log(string.lowerFirst('NID'))
// console.log(date.format(1607000082114, 'yyyy年MM-dd hh:mm:ss'))
// import { lowerFirst } from '../src/string'
// const { URL } = require('@tencent/monitor-utils');
// const url = new URL('http://www.test.com:8080/user');
// const url = new URL('https://www.test.com:8080/user/?box=test&box=nima&a=1&name=#ccc');

// url.addQuery('name', 'zhang');
// url.addQuery({
//   a: 1,
//   b: 2,
// });
// url.addQuery('box1', 'nima', URL.RULES.REPLACE)
// console.log(lowerFirst('FFFF反hhhffffff反复复付付F'))
// const queryString = URL.queryStringify({
//   name: 'zhangsan',
//   age: 4,
//   box: [1, 2]
// })
// console.log(queryString)

// const query1 = URL.parse(url.getHref())
// console.log(query1)

// console.log(queryString);

// const query = URL.parseQuery('a=3&b=4');

// console.log(query);

// const parsed = URL.parse('https://www.test.com:8080/user/?box=test#ccc', true);
// console.log(parsed);

// url.removeQuery('b');

// url.removeQuery(['box', 'name']);
// console.log(url.href, url.search, url.pathname);

// console.log(url.setHostname('www.baidu.com').getHref());

// const URI = require('urijs')
// const uri = new URI('https://www.test.com:8080/user/?box=test&box=test1&name=#ccc')
// console.log(URI.parseQuery('box=test&box=test1'))
// console.log(uri.query())
// console.log(url.setQuery('xx=33').getHref())

// console.log(url.hasQuery('a', 1), url.getQuery())

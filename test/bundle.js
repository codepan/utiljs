var defaultFormatPattern = 'yyyy年MM月dd日 hh时mm分ss秒';
var patternRegExp = /([yMdwhms]+)/g;

var paddingLeftZero = function (str, length) {
    str += '';
    return length === 2 ? ("00" + str).substr(str.length) : str;
};
var createDateInstance = function (date) {
    if (!date) {
        return new Date();
    }
    if (typeof date === 'string') {
        // safari 中不支持中划线-格式的年月日格式，但兼容性很好
        date = date.replace('-', '/');
        date = new Date(date);
    }
    if (typeof date === 'number') {
        date = new Date(date);
    }
    if (date instanceof Date) {
        // 处理 Invalid Date 的情况
        if (Number.isNaN(date.getTime())) {
            return null;
        }
    }
    return date;
};

/**
 *
 * @param date 将要格式化的日期
 * @param pattern 格式化模式，默认为：'yyyy年MM月dd日 hh时mm分ss秒'
 * @example
 * 格式化当前日期 format('')或format(undefined)或format(null)
 * 传入时间戳 format(1607000082114)
 */
function format(date, pattern) {
    if (pattern === void 0) { pattern = defaultFormatPattern; }
    var dateInstance = createDateInstance(date);
    console.log(dateInstance);
    if (!dateInstance) {
        return '';
    }
    if (typeof pattern !== 'string') {
        pattern = defaultFormatPattern;
    }
    return pattern.replace(patternRegExp, function (match, $1) {
        var length = $1.length;
        switch ($1.charAt(0)) {
            case 'y':
                var year = dateInstance.getFullYear().toString();
                return year.substr(year.length - length);
            case 'M': return paddingLeftZero(dateInstance.getMonth() + 1, length);
            case 'd': return paddingLeftZero(dateInstance.getDate(), length);
            case 'w': return String(dateInstance.getDay() + 1);
            case 'h': return paddingLeftZero(dateInstance.getHours(), length);
            case 'm': return paddingLeftZero(dateInstance.getMinutes(), length);
            case 's': return paddingLeftZero(dateInstance.getSeconds(), length);
        }
    });
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 * 添加查询参数时的规则
 * keep：保持原样，即放弃本次重复添加的参数，保持原有的参数
 * repeat：允许重复添加，全部保留住
 * replace：替换，新值替换掉旧值
 */
var RULES = {
    KEEP: 'keep',
    REPEAT: 'repeat',
    REPLACE: 'replace',
};

var parseQueryString = function (queryString) {
    var rawString = queryString.startsWith('?') ? queryString.substr(1) : queryString;
    var paramEntries = rawString.split('&');
    var query = paramEntries.reduce(function (memo, entry) {
        var _a = entry.split('='), key = _a[0], value = _a[1];
        // eslint-disable-next-line no-param-reassign
        if (memo[key]) {
            Array.isArray(memo[key]) ? memo[key].push(value) : memo[key] = [memo[key], value];
        }
        else {
            memo[key] = value;
        }
        return memo;
    }, {});
    return query;
};
var formatHref = function (href) {
    var hasProtocolStart = href.indexOf('//') >= 0;
    var pathnameStartIndex = href.indexOf('/', href.indexOf('//') + 2);
    if (!hasProtocolStart || pathnameStartIndex !== -1)
        return href;
    if (href.includes('?')) {
        var searchIndex = href.indexOf('?');
        return href.substring(0, searchIndex) + "/" + href.substring(searchIndex);
    }
    if (href.includes('#')) {
        var hashIndex = href.indexOf('#');
        return href.substring(0, hashIndex) + "/" + href.substring(hashIndex);
    }
    return href + "/";
};
var typeChecker = {
    isObject: function (target) { return Object.prototype.toString.call(target) === '[object Object]'; },
    isBoolean: function (target) { return typeof target === 'boolean'; },
    isString: function (target) { return typeof target === 'string'; },
    isNumber: function (target) { return typeof target === 'number'; },
    isRegExp: function (target) { return typeof target === 'object' && target instanceof RegExp; },
    isFunction: function (target) { return typeof target === 'function'; },
    isUndefined: function (target) { return typeof target === 'undefined'; },
};

var URL = /** @class */ (function () {
    function URL(href) {
        this.href = formatHref(href);
    }
    URL.prototype.setHref = function (href) {
        this.href = formatHref(href);
        return this;
    };
    URL.prototype.getHref = function () {
        return this.href;
    };
    /**
     * 设置协议
     * @param protocol 协议
     * @returns URL实例
     * @example
     * const url = new URL('http://example.com/test/hello.html')
     * url.setProtocol('https') // 设置协议为https
     * url.getHref() // 'https://example.com/test/hello.html'
     * url.setProtocol('') // 设置相对协议
     * url.getHref() // '//example.com/test/hello.html'
     */
    URL.prototype.setProtocol = function (protocol) {
        if (typeof protocol === 'undefined')
            return this;
        var href = this.getHref();
        href = href.replace(this.getProtocol(), protocol);
        this.setHref(protocol === '' ? href.substr(1) : href);
        return this;
    };
    /**
     * 获取协议
     * @returns 协议
     */
    URL.prototype.getProtocol = function () {
        var url = this.getHref();
        return url.substring(0, url.indexOf('//') - 1);
    };
    /**
     * 设置查询字符串
     * @description 传入空字符串，可实现全部清空查询字符串功能
     * @param search 查询字符串
     * @returns URL实例
     */
    URL.prototype.setSearch = function (search) {
        var href = this.getHref();
        var originSearch = this.getSearch();
        if (search) {
            search = search.startsWith('?') ? search : "?" + search;
        }
        if (!originSearch)
            return this.setHref("" + href + search);
        href = href.replace(originSearch, search);
        return this.setHref(href);
    };
    /**
     * 获取查询字符串，包含?
     * @returns 查询字符串，包含?
     */
    URL.prototype.getSearch = function () {
        var url = this.getHref();
        var hasHash = url.includes('#');
        var hasSearch = url.includes('?');
        if (!hasSearch)
            return '';
        if (hasHash)
            return url.substring(url.indexOf('?'), url.indexOf('#'));
        return url.substring(url.indexOf('?'));
    };
    /**
     * 设置查询字符串
     * @description 该方法与setSearch表现行为完全一致
     * @param queryString 查询字符串
     * @returns URL实例
     */
    URL.prototype.setQuery = function (queryString) {
        return this.setSearch(queryString);
    };
    /**
     * 获取查询字符串或解析后的对象
     * @param isParseQueryString 是否解析，默认为true
     * @returns
     * string 查询字符串
     * object 解析后的对象
     */
    URL.prototype.getQuery = function (isParseQueryString) {
        if (isParseQueryString === void 0) { isParseQueryString = true; }
        var url = this.getHref();
        var startIndex = url.indexOf('?');
        var hashIndex = url.indexOf('#');
        var queryString = '';
        if (startIndex === -1)
            return isParseQueryString ? {} : '';
        if (hashIndex === -1) {
            queryString = url.substr(startIndex + 1);
        }
        else if (startIndex < hashIndex) {
            queryString = url.substring(startIndex + 1, hashIndex);
        }
        if (!queryString)
            return isParseQueryString ? {} : '';
        return isParseQueryString ? parseQueryString(queryString) : queryString;
    };
    /**
     * 设置主机
     * @param host 主机
     * @returns URL实例
     */
    URL.prototype.setHost = function (host) {
        var href = this.getHref();
        href = href.replace(this.getHost(), host);
        return this.setHref(href);
    };
    /**
     * 获取主机，包含端口
     * @returns 主机
     */
    URL.prototype.getHost = function () {
        var href = this.getHref();
        if (!href.includes('//'))
            return '';
        var startIndex = href.indexOf('//') + 2;
        var endIndex = href.indexOf('/', startIndex);
        if (endIndex === -1)
            return href.substring(startIndex);
        return href.substring(startIndex, endIndex);
    };
    /**
     * 设置主机名
     * @param hostname 主机名
     */
    URL.prototype.setHostname = function (hostname) {
        var href = this.getHref();
        href = href.startsWith('/') ? href : "/" + href;
        href = href.replace(this.getHostname(), hostname);
        return this.setHref(href);
    };
    /**
     * 获取主机名，不包含端口
     * @returns 主机名
     * http://www.test.com:8080/user
     */
    URL.prototype.getHostname = function () {
        var host = this.getHost();
        if (!host)
            return '';
        if (!host.includes(':'))
            return host;
        return host.split(':')[0];
    };
    /**
     * 设置源
     * @param origin 源
     * @returns URL实例
     */
    URL.prototype.setOrigin = function (origin) {
        var href = this.getHref();
        href = href.replace(this.getOrigin(), origin);
        return this.setHref(href);
    };
    /**
     * 获取源
     * @returns 源
     */
    URL.prototype.getOrigin = function () {
        var _a = [this.getProtocol(), this.getHost()], protocol = _a[0], host = _a[1];
        if (!host)
            return '';
        if (!protocol)
            return host;
        return protocol + "://" + host;
    };
    /**
     * 设置端口
     * @param port 端口
     * @returns URL实例
     */
    URL.prototype.setPort = function (port) {
        var href = this.getHref();
        href = href.replace(this.getPort(), port);
        return this.setHref(href);
    };
    /**
     * 获取端口
     * @returns 端口
     */
    URL.prototype.getPort = function () {
        var host = this.getHost();
        if (!host || !host.includes(':'))
            return '';
        return host.split(':')[1];
    };
    /**
     * 设置路径名
     * @param pathname 路径名
     * @returns URL实例
     */
    URL.prototype.setPathname = function (pathname) {
        var href = this.getHref();
        href = href.replace(this.getPathname(), pathname);
        return this.setHref(href);
    };
    /**
     * 获取路径名
     * @returns 路径名
     */
    URL.prototype.getPathname = function () {
        var url = this.getHref();
        var origin = this.getOrigin();
        var startIndex = origin.length;
        var endIndex = url.indexOf('?') || url.indexOf('#');
        if (startIndex === -1)
            return '/';
        if (endIndex === -1)
            return url.substring(startIndex);
        return url.substring(startIndex, endIndex);
    };
    /**
     * 设置哈希
     * @param hash 哈希
     * @returns URL实例
     */
    URL.prototype.setHash = function (hash) {
        var href = this.getHref();
        hash = hash.startsWith('#') ? hash : "#" + hash;
        if (!this.getHash()) {
            return this.setHref("" + href + hash);
        }
        href = href.replace(this.getHash(), hash);
        return this.setHref(href);
    };
    /**
     * 获取哈希
     * @returns 哈希
     */
    URL.prototype.getHash = function () {
        var url = this.getHref();
        var hasHash = url.includes('#');
        return hasHash ? url.substring(url.indexOf('#')) : '';
    };
    /**
     * 设置片段
     * @param fragment 片段
     * @returns URL实例
     */
    URL.prototype.setFragment = function (fragment) {
        return this.setHash(fragment);
    };
    /**
     * 获取片段，其实就是：不包含#的哈希
     * @returns 片段
     */
    URL.prototype.getFragment = function () {
        return this.getHash().substring(1);
    };
    /**
     * 设置条件
     * @param condition 条件
     * @returns URL实例
     * @description 条件是指：包含search和hash的字符串
     */
    URL.prototype.setCondition = function (condition) {
        var href = this.getHref();
        return this.setHref(href.replace(this.getSearch() + this.getHash(), condition));
    };
    /**
     * 获取条件
     * @returns 条件
     * @description 条件是指：包含search和hash的字符串
     */
    URL.prototype.getCondition = function () {
        return this.getSearch() + this.getHash();
    };
    /**
     * 设置路径
     * @param path 路径
     * @returns URL实例
     * @description 路径是指：包含了pathname、search和hash
     */
    URL.prototype.setPath = function (path) {
        var origin = this.getOrigin();
        if (!origin)
            return this.setHref(path);
        return this.setHref("" + origin + path);
    };
    /**
     * 获取路径
     * @returns 路径
     * @description 路径是指：包含了pathname、search和hash
     */
    URL.prototype.getPath = function () {
        return this.getPathname() + this.getSearch() + this.getHash();
    };
    /**
     * 获取除去通过 withoutKey 参数指定的其余部分
     * @param withoutKey 欲排除的部分，类型为WithoutKey，字符串类型，有protocol、origin、condition、hash四种取值
     * @returns 除去 withoutKey 参数指定的其余部分
     * @example
     * const url = new URL('https://www.test.com/user/profile?name=zhang#test')
     * url.getPartsWithout('condition') // https://www.test.com/user/profile
     */
    URL.prototype.getPartOfWithout = function (withoutKey) {
        var href = this.getHref();
        switch (withoutKey) {
            case 'protocol': return href.replace(this.getProtocol() + ":", '');
            case 'origin': return href.replace(this.getOrigin(), '');
            case 'condition': return href.replace(this.getCondition(), '');
            case 'hash': return href.replace(this.getHash(), '');
        }
    };
    /**
     * 解析整个url
     * @param isParseQueryString 是否解析查询字符串，默认为true
     * @returns 对象
     */
    URL.prototype.parse = function (isParseQueryString) {
        if (isParseQueryString === void 0) { isParseQueryString = true; }
        return {
            protocol: this.getProtocol(),
            host: this.getHost(),
            hostname: this.getHostname(),
            port: this.getPort(),
            origin: this.getOrigin(),
            path: this.getPath(),
            pathname: this.getPathname(),
            href: this.getHref(),
            search: this.getSearch(),
            query: this.getQuery(isParseQueryString),
            hash: this.getHash(),
            fragment: this.getFragment(),
        };
    };
    /**
     * 添加查询参数
     * @param key 查询参数键/查询参数对象
     * @param value 查询参数值，可选
     * @param rule 参数重名处理规则，可选，取值请调用 URL.RULES.XXX，默认为replace
     * @returns URL实例
     */
    URL.prototype.addQuery = function (key, value, rule) {
        var _a, _b, _c;
        if (rule === void 0) { rule = RULES.REPLACE; }
        var url = this.getHref();
        var query = this.getQuery();
        var search = this.getSearch();
        var hash = this.getHash();
        var _d = ['', ''], left = _d[0], right = _d[1];
        if (search) {
            _a = url.split(search), left = _a[0], right = _a[1];
        }
        else {
            if (hash) {
                _b = [url.split(hash)[0], hash], left = _b[0], right = _b[1];
            }
            else {
                _c = [url, ''], left = _c[0], right = _c[1];
            }
        }
        if (typeChecker.isObject(key)) {
            rule = value || rule;
            switch (rule) {
                case RULES.REPLACE:
                    query = __assign(__assign({}, query), key);
                    break;
                case RULES.REPEAT:
                    Object.entries(key).forEach(function (_a) {
                        var _b;
                        var key = _a[0], value = _a[1];
                        if (!query[key]) {
                            query[key] = value;
                        }
                        else {
                            if (Array.isArray(query[key])) {
                                Array.isArray(value) ? (_b = query[key]).push.apply(_b, value) : query[key].push(value);
                            }
                            else {
                                Array.isArray(value) ? query[key] = __spreadArrays([query[key]], value) : query[key] = [query[key], value];
                            }
                        }
                    });
                    break;
                case RULES.KEEP:
                    query = __assign(__assign({}, key), query);
            }
        }
        else {
            key = key;
            switch (rule) {
                case RULES.REPLACE:
                    query[key] = value;
                    break;
                case RULES.REPEAT:
                    query[key] ? query[key] = [query[key], value] : query[key] = value;
                    break;
                case RULES.KEEP:
                    if (!query[key])
                        query[key] = value;
            }
        }
        var queryString = URL.queryStringify(query);
        return this.setHref(left + "?" + queryString + right);
    };
    /**
     * 移除查询参数
     * @param keyOrKeys 欲删除的查询参数键/键数组/键值对
     * @returns URL实例
     */
    URL.prototype.removeQuery = function (keyOrKeysOrKeyValue, value) {
        var url = this.getHref();
        var query = this.getQuery();
        var search = this.getSearch();
        var _a = url.split(search), left = _a[0], right = _a[1];
        if (typeChecker.isObject(keyOrKeysOrKeyValue)) {
            Object.entries(keyOrKeysOrKeyValue).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var targetValue = query[key];
                if (targetValue) {
                    if (Array.isArray(targetValue)) {
                        targetValue.splice(targetValue.indexOf(value), 1);
                    }
                    else {
                        delete query[key];
                    }
                }
            });
        }
        else if (Array.isArray(keyOrKeysOrKeyValue)) {
            keyOrKeysOrKeyValue.forEach(function (key) { return delete query[key]; });
        }
        else {
            var key = keyOrKeysOrKeyValue;
            var targetValue = query[key];
            if (!value) {
                delete query[key];
            }
            else {
                if (!targetValue) {
                    delete query[key];
                }
                else {
                    if (Array.isArray(targetValue)) {
                        targetValue.includes(value) && targetValue.splice(targetValue.indexOf(value), 1);
                    }
                    else {
                        targetValue === value && delete query[key];
                    }
                }
            }
        }
        var queryString = URL.queryStringify(query);
        if (!queryString)
            return this.setHref("" + left + right);
        return this.setHref(left + "?" + queryString + right);
    };
    URL.prototype.hasQuery = function (key, value) {
        var query = this.getQuery();
        if (typeChecker.isUndefined(value)) {
            if (typeChecker.isRegExp(key)) {
                return !!Object.keys(query).find(function (queryKey) { return key.test(queryKey); });
            }
            return query.hasOwnProperty(key);
        }
        if (typeChecker.isBoolean(value)) {
            value = value;
            if (typeChecker.isRegExp(key)) {
                return !!Object.entries(query).find(function (_a) {
                    var queryKey = _a[0], queryValue = _a[1];
                    return key.test(queryKey) && queryValue;
                });
            }
            key = key;
            return value ? Boolean(query[key]) : query.hasOwnProperty(key);
        }
        if (typeChecker.isString(value) || typeChecker.isNumber(value)) {
            value += '';
            if (typeChecker.isRegExp(key)) {
                return !!Object.keys(query).find(function (queryKey) { return key.test(queryKey); });
            }
            var queryValue = query[key];
            var queryValues = Array.isArray(queryValue) ? queryValue : [queryValue];
            return queryValues.includes(value);
        }
        if (typeChecker.isRegExp(value)) {
            var isValueMatched_1 = function (queryValue) {
                var valueMatched = false;
                if (Array.isArray(queryValue)) {
                    valueMatched = !!queryValue.find(function (item) { return value.test(item); });
                }
                else {
                    valueMatched = value.test(queryValue);
                }
                return valueMatched;
            };
            if (typeChecker.isRegExp(key)) {
                return !!Object.entries(query).find(function (_a) {
                    var queryKey = _a[0], queryValue = _a[1];
                    return key.test(queryKey) && isValueMatched_1(queryValue);
                });
            }
            return query.hasOwnProperty(key) && isValueMatched_1(query[key]);
        }
        if (Array.isArray(value)) {
            var queryValue_1 = query[key];
            if (!queryValue_1 || !Array.isArray(queryValue_1))
                return false;
            return value.every(function (item) { return queryValue_1.includes(String(item)); });
        }
        if (typeChecker.isFunction(value)) {
            key = key;
            value = value;
            return value(query[key], key, query);
        }
        return false;
    };
    /**
     * 解析url地址
     * @param href 被解析字符串
     * @param isParseQueryString 是否解析查询字符串，默认为true
     * @returns
     */
    URL.parse = function (href, isParseQueryString) {
        if (isParseQueryString === void 0) { isParseQueryString = true; }
        return new URL(href).parse(isParseQueryString);
    };
    /**
     * 解析查询字符串
     * @param queryString 查询字符串
     */
    URL.parseQuery = function (queryString) {
        return parseQueryString(queryString);
    };
    /**
     * 序列化查询字符串对象
     * @param query 查询字符串对象
     * @returns 查询字符串
     */
    URL.queryStringify = function (query) {
        var queryStringList = Object.entries(query).reduce(function (memo, _a) {
            var key = _a[0], value = _a[1];
            if (Array.isArray(value)) {
                value.forEach(function (val) { return memo.push(key + "=" + val); });
            }
            else {
                memo.push(key + "=" + value);
            }
            return memo;
        }, []);
        return queryStringList.join('&');
    };
    /**
     * 连接url各项组成部分，组成一个完整的url
     * @param parts url各项组成部分
     * @description 可以任意传入url任何组成部分
     * @description 当既要传入 查询字符串/查询对象，又要传入 hash 时，hash 为最后一个参数，查询字符串/查询对象 为倒数第二个参数
     * @description 否则，查询字符串/查询对象 或 hash 为最后一个参数
     */
    URL.join = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        if (!parts || !parts.length)
            return '';
        if (parts.length === 1) {
            var part = parts[0];
            if (typeChecker.isObject(part)) {
                return URL.queryStringify(part);
            }
            return part;
        }
        if (parts.length === 2) {
            var part1 = parts[0], part2 = parts[1];
            if (typeChecker.isObject(part1)) {
                return "" + URL.queryStringify(part1) + part2;
            }
            if (typeChecker.isObject(part2)) {
                return new URL(part1)
                    .addQuery(part2)
                    .getHref();
            }
            return "" + part1 + part2;
        }
        var likeHash = parts.pop();
        var likeQuery = parts.pop();
        if (typeChecker.isObject(likeHash)) {
            var baseURL = "" + parts.join('') + likeQuery;
            return new URL(baseURL)
                .addQuery(likeHash)
                .getHref();
        }
        if (typeChecker.isObject(likeQuery)) {
            var baseURL = parts.join('');
            return new URL(baseURL)
                .addQuery(likeQuery)
                .setHash(likeHash)
                .getHref();
        }
        return "" + parts.join('') + likeQuery + likeHash;
    };
    /**
     * 添加查询参数重名处理规则
     * @field KEEP 保持原样，即放弃本次重复添加的参数，保留原有的参数
     * @field REPEAT 允许重复添加，全部保留住
     * @field REPLACE 替换，新值替换掉旧值
     */
    URL.RULES = RULES;
    return URL;
}());

console.log(format(1607000082114, 'yyyy年MM-dd hh:mm:ss'));
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

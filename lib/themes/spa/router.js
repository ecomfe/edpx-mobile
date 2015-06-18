/**
 * @file 路由配置管理
 * @author treelite(c.xinle@gmail.com)
 */

var path = require('path');
var scaffold = require('../../scaffold');

/**
 * 默认文件夹
 *
 * @const
 * @type {string}
 */
var DIR = 'src';

/**
 * 路由配置文件名
 *
 * @const
 * @type {string}
 */
var FILE_NAME = 'config';

/**
 * 路由配置文件路径
 *
 * @const
 * @type {string}
 */
var FILE = FILE_NAME + '.js';

/**
 * 输出时格式化
 *
 * @inner
 * @param {Array} data 路由信息
 * @return {Array}
 */
function format(data) {
    var res = [];

    data.forEach(function (item) {
        var info = [];
        var data;
        Object.keys(item).forEach(function (key) {
            data = item[key];
            if (key === 'action') {
                if (data.charAt(0) !== '.') {
                    data = './' + data;
                }
                info.push('action: require(\'' + data + '\')');
            }
            else if (typeof data === 'string') {
                info.push(key + ': \'' + data + '\'');
            }
            else {
                info.push(key + ': ' + data);
            }
        });
        res.push('{' + info.join(', ') + '}');
    });

    return res;
}

/**
 * 获取路由配置文件的路径
 *
 * @param {string} base 相对文件
 * @return {string}
 */
function getFilePath(base) {
    var file;
    var info = require('edp-project').getInfo();

    if (info) {
        file = path.resolve(info.dir, DIR, FILE);
    }

    if (base) {
        file = path.relative(path.dirname(file), base.replace(/\.[^.]*$/, ''));
    }

    return file;
}

/**
 * 创建路由配置文件
 *
 * @public
 * @param {Array=} data 配置信息
 */
exports.create = function (data) {
    var file = getFilePath();

    if (file) {
        scaffold.generate('spa/config', file, {routes: format(data || [])});
    }
};

/**
 * 获取路由配置信息
 *
 * @public
 * @return {?Array.<Object>} 配置信息
 */
exports.get = function () {
    var fs = require('fs');
    var file = getFilePath();
    var res = [];

    if (!file || !fs.existsSync(file)) {
        return res;
    }

    // 注册全局的define函数
    // 解决amd中的define函数
    global.define = function (fn) {
        // 模拟局部require函数
        // 将{action: require('./action')}
        // 转化为 {action: './action'}
        res = fn(function (url) {
            return url;
        });

    };

    try {
        // 通过require的形式获取配置信息
        var module = path.dirname(file) + '/' + FILE_NAME;
        if (file in require.cache) {
            delete require.cache[file];
        }
        require(module);
    }
    catch (e) {}

    return res;
};

/**
 * 添加路由配置信息
 *
 * @public
 * @param {string} url 路径
 * @param {string} file 处理文件
 */
exports.add = function (url, file) {
    var routes = exports.get();

    if (routes) {
        routes.push({
            path: url,
            action: getFilePath(file)
        });
        exports.create(routes);
    }
};

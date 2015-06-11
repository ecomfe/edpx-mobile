/**
 * @file 路由配置管理
 * @author treelite(c.xinle@gmail.com)
 */

var scaffold = require('../../scaffold');

/**
 * 配置配置文件夹
 *
 * @const
 * @type {string}
 */
var DIR = 'lib';

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
 * 获取路由配置文件的路径
 *
 * @param {string} base 相对文件
 * @return {string}
 */
function getFilePath(base) {
    var file;
    var path = require('path');
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

    var routes = (data || []).map(function (item) {
        var info = [];
        var value;
        Object.keys(item).forEach(function (key) {
            value = item[key];
            if (typeof value === 'string') {
                info.push(key + ': \'' + value + '\'');
            }
            else {
                info.push(key + ': ' + value);
            }
        });
        return '{' + info.join(', ') + '}';
    });

    if (file) {
        scaffold.generate('iso/router', file, {routes: routes});
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
    var path = require('path');
    var file = getFilePath();

    if (!file || !fs.existsSync(file)) {
        return;
    }

    if (file in require.cache) {
        delete require.cache[file];
    }
    return require(path.dirname(file) + '/' + FILE_NAME);
};

/**
 * 添加路由配置信息
 *
 * @public
 * @param {string} url url
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

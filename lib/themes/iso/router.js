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
 * @public
 * @return {string}
 */
exports.getFilePath = function () {
    var path;
    var info = require('edp-project').getInfo();

    if (info) {
        path = require('path').resolve(info.dir, DIR, FILE);
    }

    return path;
};

/**
 * 创建路由配置文件
 *
 * @public
 * @param {Array=} data 配置信息
 */
exports.create = function (data) {
    var file = exports.getFilePath();

    if (file) {
        scaffold.generate('iso/router', file, {routes: data || []});
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
    var file = exports.getFilePath();

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
 * @param {Object} item 路由信息
 */
exports.add = function (item) {
    var routes = exports.get();

    if (routes) {
        routes.push(item);
        exports.create(routes);
    }
};

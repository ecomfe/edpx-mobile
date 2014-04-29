/**
 * @file 路由配置管理
 * @author treelite(c.xinle@gmail.com)
 */

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
exports.createFile = function (data) {
    var file = exports.getFilePath();

    if (file) {
        scaffold.generate('spa/config', file, {routes: data || []});
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

    if (!file
        || !fs.existsSync(file)
    ) {
        return;
    }

    var res = [];
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
 * @param {Object} item
 */
exports.add = function (item) {
    var routes = exports.get();
    
    if (routes) {
        routes.push(item);
        exports.createFile(routes);
    }
};

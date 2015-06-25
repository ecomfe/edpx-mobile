/**
 * @file themes
 * @author treelite(c.xinle@gmail.com)
 */

var path = require('path');

/**
 * 主题文件夹
 *
 * @const
 * @type {string}
 */
var DIR = 'themes';


/**
 * 主题文件夹路径
 *
 * @const
 * @type {string}
 */
var BASE_DIR = path.resolve(__dirname, DIR);

/**
 * Theme
 *
 * @class
 * @param {string} name 主题名称
 */
function Theme(name) {
    this.name = name;
    this.dir = path.resolve(BASE_DIR, name);
}

/**
 * 执行主题命令
 *
 * @param {string} cmd 命令名称
 * @param {...*} args 命令参数
 * @return {Promise}
 */
Theme.prototype.exec = function (cmd) {
    var model = path.resolve(this.dir, cmd);
    var log = require('edp-core').log;
    var Deferred = require('edp-core').Deferred;

    try {
        model = require(model);
    }
    catch (e) {
        log.error('[edp mobild theme exec] '
                    + this.name
                    + ' can not find `'
                    + cmd
                    + '` command');
        return Deferred.rejected();
    }

    var args = Array.prototype.slice.call(arguments);
    args.shift();

    return model.apply(null, args);
};

/**
 * 主题名缓存
 *
 * @type {Array.<string>}
 */
var themeNames = [];

/**
 * 搜索主题
 *
 * @inner
 * @return {Array.<string>} 主题名数组
 */
function scan() {
    if (themeNames.length > 0) {
        return themeNames;
    }

    var fs = require('fs');
    var dir;
    var state;
    var files = fs.readdirSync(BASE_DIR);
    files.forEach(function (file) {
        dir = path.resolve(BASE_DIR, file);
        state = fs.statSync(dir);
        // 主题对应文件夹
        // 且文件夹下有index.js文件
        if (state.isDirectory()
            && fs.existsSync(path.resolve(dir, 'index.js'))
        ) {
            themeNames.push(file);
        }
    });

    return themeNames;
}

/**
 * 获取主题列表
 *
 * @public
 * @return {Array.<Object>} 主题列表
 */
exports.list = function () {
    var names = scan();
    var res = [];
    var extend = require('./util/extend');

    var item;
    names.forEach(function (name) {
        item = {name: name};
        // 扩展主题`index`模块的说明信息
        extend(item, require('./' + DIR + '/' + name));
        res.push(item);
    });

    return res;
};

/**
 * 列表输出当前支持的主题
 *
 * @public
 */
exports.printList = function () {
    var list = exports.list();
    var sprintf = require('sprintf').sprintf;
    var util = require('edp-core').util;

    /* eslint-disable no-console */
    console.log('Current Supported Themes:');
    list.forEach(function (item) {
        console.log(
            sprintf(
                '  %-20s %s',
                util.colorize(item.name, 'success'),
                item.describe
            )
        );
    });
    /* eslint-enable no-console */
};

/**
 * 判断主题是否存在
 *
 * @param {string} name 主题名称
 * @return {boolean}
 */
exports.exists = function (name) {
    var names = scan();

    return names.indexOf(name) >= 0;
};

/**
 * 获取主题
 *
 * @param {string} name 主题名称
 * @return {?Theme} 主题对象
 */
exports.get = function (name) {
    if (!exports.exists(name)) {
        return null;
    }
    return new Theme(name);
};

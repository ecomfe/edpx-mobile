/**
 * @file spa add
 * @author treelite(c.xinle@gmail.com)
 */

var scaffold = require('../../scaffold');
var fs = require('fs');
var edp = require('edp-core');
var log = edp.log;

/**
 * 错误日志前缀
 *
 * @const
 * @type {string}
 */
var LOG_PREFIX = '[edp mobile add] ';

/**
 * URL转化为文件路径
 *
 * @inner
 * @param {string} url
 * @return {string}
 */
function convert(url) {
    if (url.charAt(0) == '/') {
        url = url.substring(1);
    }

    var file;
    var path = require('path');
    var projectInfo = require('edp-project').getInfo();
    if (projectInfo) {
        file = path.resolve(projectInfo.dir, 'src', url);
    }
    else {
        file = path.resolve(process.cwd(), url);
    }

    return file;
}

/**
 * 确保文件所在的文件夹存在
 *
 * @inner
 * @param {string} file 文件
 */
function assetDir(file) {
    var fs = require('fs');
    var dir = require('path').dirname(file);
    if (!fs.existsSync(dir)) {
        require('mkdirp').sync(dir);
    }
}

/**
 * 处理器集合
 *
 * @type {Object}
 */
var handlers = {};

/**
 * action处理器
 * 生成action文件
 *
 * @inner
 * @param {string} file 文件路径
 * @param {string} basename 文件名
 * @param {string} url
 * @return {boolean}
 */
handlers.action = function (file, basename, url) {
    var routeConfig = require('./route');
    var routeInfo = routeConfig.get() || [];

    // 检查path是否已经存在
    var res = routeInfo.some(function (item) {
        return item.path == url;
    });
    if (res) {
        log.error(LOG_PREFIX + url + ' has existed');
        return !res;
    }

    var path = require('path');
    var module = file;
    file += '.js';

    // 检查文件是否已经存在
    if (fs.existsSync(file)) {
        log.error(LOG_PREFIX + file + ' has existed');
        return false;
    }

    var data = {
            view: './' + basename + 'View',
            model: './' + basename + 'Model',
        };
    scaffold.generate('spa/action', file, data);

    var routeFile = routeConfig.getFilePath();
    if (routeFile) {
        routeConfig.add({
            path: url,
            action: edp.path.relative(routeFile, module).substring(1)
        });
    }

    return true;
};

/**
 * view处理器
 * 生成view文件
 *
 * @inner
 * @param {string} file 文件路径
 * @param {string} basename 文件名
 * @return {boolean}
 */
handlers.view = function (file, basename) {
    file += 'View.js';
    // 检查文件是否已经存在
    if (fs.existsSync(file)) {
        log.error(LOG_PREFIX + file + ' has existed');
        return false;
    }

    var data = {
            template: './' + basename + '.tpl'
        };
    scaffold.generate('spa/view', file, data);
    return true;
};

/**
 * model处理器
 * 生成model文件
 *
 * @inner
 * @param {string} file 文件路径
 * @return {boolean}
 */
handlers.model = function (file) {
    file += 'Model.js';
    // 检查文件是否已经存在
    if (fs.existsSync(file)) {
        log.error(LOG_PREFIX + file + ' has existed');
        return false;
    }

    scaffold.generate('spa/model', file);
    return true;
};

/**
 * template处理器
 * 生成template文件
 *
 * @inner
 * @param {string} file 文件路径
 * @return {boolean}
 */
handlers.template = function (file) {
    file += '.tpl';
    // 检查文件是否已经存在
    if (fs.existsSync(file)) {
        log.error(LOG_PREFIX + file + ' has existed');
        return false;
    }

    scaffold.generate(
        'spa/template', 
        file
    );
    return true;
};

/**
 * 默认处理器
 * 生成配套的action, view, model与template
 */
function defaultHandler(file, basename, url) {
    var handler;

    return Object.keys(handlers).every(function (key) {
        handler = handlers[key];
        return handler(file, basename, url);
    });
}

/**
 * 添加文件
 *
 * @public
 * @param {string} type 文件类型
 * @param {string} url
 * @param {string} file 文件路径
 */
module.exports = function (type, url, file) {
    var path = require('path');

    // 如果不能识别type
    // 则按照没有提供type处理，修正后续参数
    if (!(type in handlers)) {
        file = url;
        url = type;
        type = null;
    }

    // 添加index目录
    if (url.charAt(url.length - 1) == '/') {
        url += 'index';
    }
    // 如果没有提供file
    // 则按照url生成对应的file
    if (!file) {
        file = convert(url);
    }
    else {
        file = path.resolve(process.cwd(), file);
    }

    assetDir(file);
    
    var handler;
    if (!type) {
        handler = defaultHandler;
    }
    else {
        handler = handlers[type];
    }

    var res = handler(
        file,
        path.basename(file),
        url
    );

    if (!res) {
        log.error(LOG_PREFIX + 'add fail ...');
    }
};

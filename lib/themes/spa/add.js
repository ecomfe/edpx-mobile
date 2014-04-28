/**
 * @file spa add
 * @author treelite(c.xinle@gmail.com)
 */

var scaffold = require('../../scaffold');

/**
 * URL转化为文件路径
 *
 * @inner
 * @param {string} url
 * @return {string}
 */
function convert(url) {
    if (url.charAt(url.length - 1) == '/') {
        url += 'index';
    }

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
 */
handlers.action = function (file, basename, url) {
    var path = require('path');
    var module = file;
    file += '.js';
    var data = {
            view: './' + basename + 'View',
            model: './' + basename + 'Model',
        };
    scaffold.generate('spa/action', file, data);

    var routeConfig = require('./route');
    var routeFile = routeConfig.getFilePath();
    if (routeFile) {
        routeConfig.add({
            path: url,
            action: path.relative(routeFile, module).substring(1)
        });
    }
};

/**
 * view处理器
 * 生成view文件
 *
 * @inner
 * @param {string} file 文件路径
 * @param {string} basename 文件名
 */
handlers.view = function (file, basename) {
    file += 'View.js';
    var data = {
            template: './' + basename + '.tpl',
            mainTarget: basename
        };
    scaffold.generate('spa/view', file, data);
};

/**
 * model处理器
 * 生成model文件
 *
 * @inner
 * @param {string} file 文件路径
 */
handlers.model = function (file) {
    file += 'Model.js';
    scaffold.generate('spa/model', file);
};

/**
 * template处理器
 * 生成template文件
 *
 * @inner
 * @param {string} file 文件路径
 */
handlers.template = function (file, basename) {
    file += '.tpl';
    scaffold.generate(
        'spa/template', 
        file, 
        {name: basename}
    );
};

/**
 * 默认处理器
 * 生成配套的action, view, model与template
 */
function defaultHandler(file, basename, url) {
    var handler;
    Object.keys(handlers).forEach(function (key) {
        handler = handlers[key];
        handler(file, basename, url);
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

    handler(
        file,
        path.basename(file),
        url
    );
};

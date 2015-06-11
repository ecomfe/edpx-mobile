/**
 * @file MVP 文件管理
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var Deferred = require('edp-core').Deferred;

var scaffold = require('./scaffold');

/**
 * 文件后缀名
 *
 * @const
 * @type {Object}
 */
var EXT_NAMES = {
    presenter: '.js',
    view: '.js',
    model: '.js',
    template: '.tpl',
    style: '.styl'
};

var generator = {};

/**
 * 生成Presenter文件
 *
 * @param {string} file 文件路径
 * @param {Object} info 配置信息
 * @param {string} basename 基本文件名
 * @param {string} url 路由路径
 * @return {Promise}
 */
generator.presenter = function (file, info, basename, url) {
    var router = require('./router');

    if (router.has(url)) {
        return Deferred.rejected(url + ' has existed in routing');
    }

    var data = {
        view: './' + basename + 'View',
        model: './' + basename + 'Model'
    };

    scaffold.generate(info.template, file, data);
    router.add(url, file);

    return Deferred.resolved(file);
};

/**
 * 生成Model文件
 *
 * @param {string} file 文件路径
 * @param {Object} info 配置信息
 * @return {Promise}
 */
generator.model = function (file, info) {
    scaffold.generate(info.template, file);
    return Deferred.resolved(file);
};

/**
 * 生成View文件
 *
 * @param {string} file 文件路径
 * @param {Object} info 配置信息
 * @param {string} basename 基本文件名
 * @return {Promise}
 */
generator.view = function (file, info, basename) {
    scaffold.generate(info.template, file, {template: './' + basename + EXT_NAMES.template});
    return Deferred.resolved(file);
};

/**
 * 生成Template文件
 *
 * @param {string} file 文件路径
 * @param {Object} info 配置信息
 * @return {Promise}
 */
generator.template = function (file, info) {
    scaffold.generate(info.template, file);
    return Deferred.resolved(file);
};

/**
 * 生成Style文件
 *
 * @param {string} file 文件路径
 * @param {Object} info 配置信息
 * @return {Promise}
 */
generator.style = function (file, info) {
    scaffold.generate(info.template, file);
    // 往主样式文件添加@require
    if (info.main) {
        var mainFile = fs.readFileSync(info.main);
        var relativePath = path.relative(info.main, file).replace(EXT_NAMES.style, '');
        mainFile += '\n@require \'' + relativePath + '\'';
        fs.writeFileSync(info.main, mainFile);
    }
    return Deferred.resolved(file);
};

/**
 * URL转化为文件路径
 *
 * @inner
 * @param {string} url url
 * @param {string} dir 根目录文件夹
 * @return {string}
 */
function convert(url, dir) {
    if (url.charAt(0) === '/') {
        url = url.substring(1);
    }

    var file;
    var projectInfo = require('edp-project').getInfo();
    if (projectInfo) {
        file = path.resolve(projectInfo.dir, dir, url);
    }
    else {
        file = path.resolve(process.cwd(), url);
    }

    return file;
}

/**
 * 生成文件
 *
 * @param {string} type 文件类型
 * @param {string} url 路由路径
 * @param {string=} file 文件路径
 * @param {Object} info 配置信息
 * @return {Promise}
 */
function generateFile(type, url, file, info) {
    if (!file) {
        file = convert(url, info.dir);
    }
    else {
        file = convert(file, info.dir);
    }

    var basename = path.basename(file);

    // 添加文件名后缀
    if (type === 'view' || type === 'model') {
        file += type.charAt(0).toUpperCase() + type.substring(1);
    }
    file += EXT_NAMES[type];

    if (fs.existsSync(file)) {
        return Deferred.rejected(file + ' has existed');
    }

    return generator[type](file, info, basename, url);
}

/**
 * 新增文件
 *
 * @public
 * @param {string=} type 文件类型
 * @param {string} url 路由路径
 * @param {string=} file 文件路径
 * @param {Object} config 文件配置信息
 * @return {Promise}
 */
exports.add = function (type, url, file, config) {
    if (!(type in EXT_NAMES)) {
        file = url;
        url = type;
        type = Object.keys(EXT_NAMES);
    }
    else {
        type = [type];
    }

    // 添加index目录
    if (url.charAt(url.length - 1) === '/') {
        url += 'index';
    }

    return Deferred.all(type.map(function (item) {
        return generateFile(item, url, file, config[item]);
    }));
};

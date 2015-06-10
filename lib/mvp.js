/**
 * @file MVP 文件管理
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var log = require('edp-core').log;
var scaffold = require('./scaffold');

var EXT_NAMES = {
    presenter: '.js',
    view: '.js',
    model: '.js',
    template: '.tpl',
    style: '.styl'
};

var generator = {};

generator.presenter = function (file, info, url, basename) {
    var router = require('./router');

    if (router.has(url)) {
        log.error(url + ' has existed in routing');
        return false;
    }

    var data = {
        view: './' + basename + 'View',
        model: './' + basename + 'Model'
    };

    scaffold.generate(info.template, file, data);
    router.add(url, file);
    return true;
};

generator.model = function (file, info) {
    scaffold.generate(info.template, file);
    return true;
};

generator.view = function (file, info, basename) {
    scaffold.generate(info.template, file, {template: './' + basename + EXT_NAMES.template});
    return true;
};

generator.template = function (file, info) {
    scaffold.generate(info.template, file);
    return true;
};

generator.style = function (file, info) {
    scaffold.generate(info.template, file);
    // 往主样式文件添加@require
    if (info.main) {
        var mainFile = fs.readFileSync(info.main);
        var relativePath = path.relative(info.main, file).replace(EXT_NAMES.style, '');
        mainFile += '\n@require \'' + relativePath + '\'';
        fs.writeFileSync(info.main, mainFile);
    }
    return true;
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
        log.error(file + ' has existed');
        return false;
    }

    return generator[type](file, info, url, basename);
}

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

    for (var i = 0, item; item = type[i]; i++) {
        if (!generateFile(item, url, file, config[item])) {
            break;
        }
    }

    return i >= type.length - 1;
};

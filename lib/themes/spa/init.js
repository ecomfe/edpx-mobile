/**
 * @file spa init
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 初始化需要的包依赖
 *
 * @type {Array.<string>}
 */
var dependencies = ['saber-firework'];

/**
 * 空函数
 *
 * @inner
 */
function blank() {}

/**
 * 导入依赖
 *
 * @inner
 * @param {Function} callback
 */
function importDeps(callback) {
    var pkg = require('edp-package');

    var index = 0;
    function next() {
        var name = dependencies[index++];

        if (!name) {
            callback();
            return;
        }

        pkg.importFromRegistry(name, process.cwd(), next);
    }

    next();
}

/**
 * 生成默认文件
 *
 * @inner
 * @param {Object} projectInfo 项目信息
 */
function generateFiles(projectInfo) {
    var path = require('path');
    var scaffold = require('../../scaffold');

    // 生成idnex.html
    var file = path.resolve(projectInfo.dir, 'index.html');
    // 获取loader相关信息
    var loader = require('edp-project').loader.getConfig(file);
    var paths = [];
    Object.keys(loader.paths).forEach(function (key) {
        paths.push({perfix: key, data: loader.paths[key]});
    });
    loader.paths = paths;
    if (loader.baseUrl
        || loader.paths.length > 0
        || loader.packages.length > 0
    ) {
        loader.config = true;
    }
    scaffold.generate('spa/index', file, {loader: loader});

    // 生成src/app.js
    file = path.resolve(projectInfo.dir, 'src/app.js');
    scaffold.generate('spa/app', file);

    // 生成路由配置文件
    require('./route').createFile();
}

/**
 * 初始化SPA项目
 *
 * @param {Object} projectInfo 项目信息
 * @param {Function=} callback 初始化完成回调函数
 */
module.exports = function (projectInfo, callback) {
    callback = callback || blank;
    importDeps(function () {
        generateFiles(projectInfo);
        callback();
    });
};

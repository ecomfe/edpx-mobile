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
    var boilerplate = require('saber-boilerplate');

    // 生成idnex.html
    var file = path.resolve(projectInfo.dir, 'index.html');
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
    boilerplate.generate('spa/index', file, {loader: loader});

    var edpConfig = require('edp-config');
    var data = {
            author: {
                name: edpConfig.get('user.name'),
                email: edpConfig.get('user.email')
            }
        };

    // 生成src/app.js
    file = path.resolve(projectInfo.dir, 'src/app.js');
    boilerplate.generate('spa/app', file, data);

    // 生成src/config.js
    file = path.resolve(projectInfo.dir, 'src/config.js');
    boilerplate.generate('spa/config', file, data);
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

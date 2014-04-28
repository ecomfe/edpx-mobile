/**
 * @file spa init
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 初始化需要的前端包依赖
 *
 * @type {Array.<string>}
 */
var edpDependencies = ['saber-firework', 'saber-ajax'];

/**
 * 初始化需要的npm包依赖
 *
 * @type {Array.<string>}
 */
var npmDependencies = ['edp-provider-rider', 'rider-ui'];

/**
 * 空函数
 *
 * @inner
 */
function blank() {}

/**
 * 导入edp依赖
 *
 * @inner
 * @param {Function} callback
 */
function importEdpDeps(callback) {
    var pkg = require('edp-package');

    var index = 0;
    function next() {
        var name = edpDependencies[index++];

        if (!name) {
            callback();
            return;
        }

        pkg.importFromRegistry(name, process.cwd(), next);
    }

    next();
}

/**
 * 导入npm依赖
 *
 * @inner
 * @param {Function} callback
 */
function importNpmDeps(callback) {
    var spawn = require('../../util/spawn');
    var childProcess;
    var i = 0;

    function next() {
        var dep = npmDependencies[i++];
        if (!dep) {
            callback();
        }
        else {
            childProcess = spawn('npm', ['install', dep, '--save']);
            childProcess.on('exit', next);
        }
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

    // 生成edp-webserver-config.js
    file = path.resolve(projectInfo.dir, 'edp-webserver-config.js');
    scaffold.generate('spa/webserver-config', file);

    // 生成edp-build-config.js
    file = path.resolve(projectInfo.dir, 'edp-build-config.js');
    scaffold.generate('spa/build-config', file);

    // 生成edp-watch-config.js
    file = path.resolve(projectInfo.dir, 'edp-watch-config.js');
    scaffold.generate('spa/watch-config', file);

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

    //importEdpDeps(function () {
        //importNpmDeps(function () {
            generateFiles(projectInfo);
            callback();
        //});
    //});
};

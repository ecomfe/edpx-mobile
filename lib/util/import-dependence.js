/**
 * @file 导入依赖
 * @author treelite(c.xinle@gmail.com)
 */

var spawn = require('./spawn');

/**
 * 从npm导入依赖
 *
 * @public
 * @param {string|Array.<string>} deps 依赖模块
 * @param {Array.<string>} opts 依赖导入参数
 * @param {Function} callback 完成回调函数
 */
exports.npm = function (deps, opts, callback) {
    if (!Array.isArray(deps)) {
        deps = [deps];
    }

    if (!opts) {
        opts = [];
    }
    else if (!Array.isArray(opts)) {
        opts = [opts];
    }

    var childProcess;
    var i = 0;

    function next() {
        var dep = deps[i++];
        if (!dep) {
            callback();
        }
        else {
            childProcess = spawn('npm', ['install', dep].concat(opts));
            childProcess.on('exit', next);
        }
    }

    next();
};

/**
 * 从edp导入依赖
 *
 * @public
 * @param {string|Array.<string>} deps 依赖模块
 * @param {Function} callback 完成回调函数
 */
exports.edp = function (deps, callback) {
    if (!Array.isArray(deps)) {
        deps = [deps];
    }

    var pkg = require('edp-package');
    var index = 0;

    function updateModuleConfig() {
        var project = require('edp-project');
        var info = project.getInfo(process.cwd());
        project.module.updateConfig(info);
    }

    function next() {
        var name = deps[index++];

        if (!name) {
            updateModuleConfig();
            callback();
            return;
        }

        pkg.importFromRegistry(name, process.cwd(), next);
    }

    next();
};

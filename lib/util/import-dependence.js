/**
 * @file 导入依赖
 * @author treelite(c.xinle@gmail.com)
 */

var Deferred = require('edp-core').Deferred;
var spawn = require('./spawn');

/**
 * 从npm导入依赖
 *
 * @public
 * @param {string|Array.<string>} deps 依赖模块
 * @param {Array.<string>} opts 依赖导入参数
 * @return {Promise}
 */
exports.npm = function (deps, opts) {
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

    var deferred = new Deferred();

    function next() {
        var dep = deps[i++];
        if (!dep) {
            deferred.resolve();
        }
        else {
            childProcess = spawn('npm', ['install', dep].concat(opts));
            childProcess.on('exit', next);
        }
    }

    next();

    return deferred.promise;
};

/**
 * 从edp导入依赖
 *
 * @public
 * @param {string|Array.<string>} deps 依赖模块
 * @return {Promise}
 */
exports.edp = function (deps) {
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

    var deferred = new Deferred();

    function next() {
        var name = deps[index++];

        if (!name) {
            updateModuleConfig();
            deferred.resolve();
        }
        else {
            pkg.importFromRegistry(name, process.cwd(), next);
        }
    }

    next();

    return deferred.promise;
};

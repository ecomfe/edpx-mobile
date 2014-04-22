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
 * 初始化SPA项目
 *
 * @param {Object} projectInfo 项目信息
 * @param {Function=} callback 初始化完成回调函数
 */
module.exports = function (projectInfo, callback) {
    callback = callback || blank;
    importDeps(callback);
};

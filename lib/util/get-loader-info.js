/**
 * @file 获取模块加载配置信息
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 获取模块加载配置信息
 *
 * @public
 * @param {string} file 文件路径
 * @return {Object}
 */
module.exports = function (file) {
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

    return loader;
};

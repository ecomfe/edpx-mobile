/**
 * @file 路由管理
 * @author treelite(c.xinle@gmail.com)
 */

var metadata = require('./metadata');

/**
 *  根据当前的theme获取到对应的router管理实例
 *
 *  @return {Object}
 */
function getRouter() {
    var theme = metadata.get('theme');
    return require('./themes/' + theme + '/router');
}

/**
 * 判断url是否已经在路由配置中
 *
 * @public
 * @param {string} url url
 * @return {boolean}
 */
exports.has = function (url) {
    var router = getRouter();
    var info = router.get();

    return info.some(function (item) {
        return item.path === url;
    });
};

/**
 * 添加路由配置
 *
 * @public
 * @param {string} path 路径
 * @param {string} file 处理文件
 */
exports.add = function (path, file) {
    var router = getRouter();
    router.add(path, file);
};

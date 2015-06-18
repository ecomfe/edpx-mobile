/**
 * @file 脚手架文件管理
 * @author treelite(c.xinle@gmail.com)
 */

var boilerplate = require('saber-boilerplate');

/**
 * 根据模版生成文件
 *
 * @public
 * @param {string} name 模版名称
 * @param {string} file 生成文件路径
 * @param {Object=} data 模版数据
 */
exports.generate = function (name, file, data) {
    var extend = require('./util/extend');
    var edpConfig = require('edp-config');
    var baseData = {
        author: {
            name: edpConfig.get('user.name'),
            email: edpConfig.get('user.email')
        }
    };

    extend(baseData, data);

    boilerplate.generate(name, file, baseData);
};

/**
 * 获取配置信息
 *
 * @public
 * @param {string} name 配置文件名
 * @return {Object}
 */
exports.getConfig = function (name) {
    return boilerplate.getConfig(name);
};

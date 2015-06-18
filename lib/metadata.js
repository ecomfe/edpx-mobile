/**
 * @file metadata
 * @author c.xinle@gmail.com
 */

var project = require('edp-project');

/**
 * 元数据总字段名称
 *
 * @const
 * @type {string}
 */
var KEY = 'mobile';

/**
 * 获取元数据
 *
 * @public
 * @param {string=} name 名称
 * @return {*}
 */
exports.get = function (name) {
    var info = project.getInfo();

    if (!info) {
        return null;
    }

    var meta = project.metadata.get(info);
    var data = meta[KEY] || {};

    return name ? data[name] : data;
};

/**
 * 设置元数据
 *
 * @public
 * @param {string} name 名称
 * @param {*} value  值
 */
exports.set = function (name, value) {
    var info = project.getInfo();

    if (!info) {
        return;
    }

    var meta = project.metadata.get(info);
    var data = meta[KEY] || {};

    data[name] = value;
    meta[KEY] = data;

    project.metadata.set(info, meta);
};

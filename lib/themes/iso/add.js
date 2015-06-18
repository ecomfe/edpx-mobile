/**
 * @file iso add
 * @author treelite(c.xinle@gmail.com)
 */

var mvp = require('../../mvp');

var config = {
    presenter: {
        dir: 'lib',
        template: 'iso/presenter'
    },
    view: {
        dir: 'lib',
        template: 'iso/view'
    },
    model: {
        dir: 'lib',
        template: 'iso/model'
    },
    template: {
        dir: 'lib',
        template: 'iso/template'
    },
    style: {
        dir: 'src',
        template: 'iso/style'
    }
};

/**
 * 添加文件
 *
 * @public
 * @param {string} type 文件类型
 * @param {string} url url
 * @param {string} file 文件路径
 * @return {Promise}
 */
module.exports = function (type, url, file) {
    return mvp.add(type, url, file, config);
};

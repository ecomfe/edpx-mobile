/**
 * @file spa add
 * @author treelite(c.xinle@gmail.com)
 */

var mvp = require('../../mvp');

var config = {
    presenter: {
        dir: 'src',
        template: 'spa/presenter'
    },
    view: {
        dir: 'src',
        template: 'spa/view'
    },
    model: {
        dir: 'src',
        template: 'spa/model'
    },
    template: {
        dir: 'src',
        template: 'spa/template'
    },
    style: {
        dir: 'src',
        template: 'spa/style'
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

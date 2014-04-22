/**
 * @file mobile
 * @author treelite(c.xinle@gmail.com)
 */

var metadata = require('../lib/metadata');
var log = require('edp-core').log;

/**
 * 命令行配置相
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '移动脚手架';

/**
 * 命令入口
 *
 * @public
 */
cli.main = function () {
    var theme = metadata.get('theme');

    if (!theme) {
        log.info('not in mobile project dir');
    }
    else {
        log.info('current project\'s theme is' + theme);
    }
};

// 导出命令
exports.cli = cli;

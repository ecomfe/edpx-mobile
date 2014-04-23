/**
 * @file main command
 * @author treelite(c.xinle@gmail.com)
 */

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
    var metadata = require('../lib/metadata');
    var core = require('edp-core');
    var log = core.log;
    var util = core.util;
    var theme = metadata.get('theme');

    if (!theme) {
        log.info('not in mobile project dir');
        log.info('use `edp mobile init [theme]` to init mobile project');
    }
    else {
        log.info('current project\'s theme is ' + util.colorize(theme, 'success'));
    }
};

// 导出命令
exports.cli = cli;

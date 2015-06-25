/**
 * @file 项目构建
 * @author treelite(c.xinle@gmail.com)
 */

var core = require('edp-core');
var log = core.log;
var themes = require('../../lib/themes');
var metadata = require('../../lib/metadata');

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
cli.description = '项目构建';

/**
 * 命令选项
 */
cli.options = ['force'];

/**
 * 命令入口
 *
 * @public
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令选项
 */
cli.main = function (args, opts) {
    var theme = themes.get(metadata.get('theme'));

    if (!theme) {
        log.error('Not in project dir');
        return;
    }

    theme.exec('build', opts);
};

// 导出命令
exports.cli = cli;

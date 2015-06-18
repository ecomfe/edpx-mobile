/**
 * @file add command
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 日志前缀
 *
 * @const
 * @type {string}
 */
var LOG_PERFIX = '[edp mobile add] ';

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
cli.description = '添加文件';

/**
 * 命令选项
 */
cli.options = ['theme:'];

/**
 * 命令入口
 *
 * @public
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令选项
 */
cli.main = function (args, opts) {
    var core = require('edp-core');
    var log = core.log;
    var util = core.util;
    var metadata = require('../../lib/metadata');
    var themes = require('../../lib/themes');
    var themeName = metadata.get('theme');

    if (!themeName) {
        themeName = opts.theme;
    }
    else if (opts.theme) {
        log.warn('Current project\'s scheme is ' + util.colorize(themeName, 'success') + ', ignore `--theme`');
    }

    if (!themeName) {
        log.error(LOG_PERFIX + 'Please input scheme name');
        log.info('Usage: edp mobile add xxxx --theme=spa');
        themes.printList();
        return;
    }

    var theme = themes.get(themeName);

    if (!theme) {
        log.error(LOG_PERFIX + 'Incorrect theme name');
        themes.printList();
        return;
    }

    args.unshift('add');

    theme.exec.apply(theme, args)
        .then(
            function () {
                // edp-core的Deferred不兼容Promise/A+规范
                // Deferred.all返回的是多个参数而非Promise/A+的规定的一个数组
                var files = Array.prototype.slice.call(arguments);
                files.forEach(function (file) {
                    log.info(file);
                });
                log.info('add success');
            },
            function (reason) {
                log.error(reason);
                log.error('add fail ...');
            }
        );
};

// 导出命令
exports.cli = cli;

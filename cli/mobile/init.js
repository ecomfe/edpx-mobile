/**
 * @file init command
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 日志前缀
 *
 * @const
 * @type {string}
 */
var LOG_PERFIX = '[edp mobile init] ';

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
cli.description = '初始化移动项目';

/**
 * 命令入口
 *
 * @public
 * @param {Array} args 命令运行参数
 */
cli.main = function (args) {
    var log = require('edp-core').log;
    var themes = require('../../lib/themes');

    if (args.length <= 0) {
        log.error(LOG_PERFIX + 'Please input the theme name');
        themes.printList();
        return;
    }

    var theme = themes.get(args[0]);
    if (!theme) {
        log.error(LOG_PERFIX + 'Incorrect theme name');
        themes.printList();
        return;
    }

    var project = require('edp-project');
    var metadata = require('../../lib/metadata');

    try {
        // normal project init
        var info = project.init(process.cwd());
        project.dir.init(info);
        project.build.createConfigFile(info);
        project.webserver.createConfigFile(info);

        // mobile project init
        metadata.set('theme', theme.name);
        // execute init cmd
        theme.exec('init', info)
            .then(
                function () {
                    log.info('init mobile project done');
                },
                function (reason) {
                    log.error('init fail: ' + reason);
                }
            );
    }
    catch (e) {
        log.error(LOG_PERFIX + e.message);
    }
};

// 导出命令
exports.cli = cli;

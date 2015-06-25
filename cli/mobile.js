/**
 * @file main command
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var sprintf = require('sprintf');
var util = require('edp-core').util;

/* eslint-disable no-console */

/**
 * 显示命令
 *
 * @param {string} file 命令文件路径
 */
function echoCommand(file) {
    var cli = require(file).cli;
    console.log(
        sprintf(
            '  %-20s %s',
            util.colorize(path.basename(file), 'success'),
            cli.description
        )
    );
}

/**
 * 显示所有命令
 */
function lsCommand() {
    console.log('Builtin commands:');
    var dir = path.resolve(__dirname, 'mobile');
    var files = fs.readdirSync(dir);
    files.forEach(function (file) {
        file = path.resolve(dir, file);
        if (path.extname(file) === '.js') {
            echoCommand(file.replace(/\.[^.]*$/, ''));
        }
    });
}

/* eslint-enable no-console */

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

    lsCommand();

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

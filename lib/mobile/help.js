/**
 * @file 帮助模块入口
 * @author firede[firede@firede.us]
 */

var help = require( '../help' );

/**
 * 命令行配置项
 * 
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 * 
 * @type {string}
 */
cli.command = 'help';

/**
 * 命令描述信息
 * 
 * @type {string}
 */
cli.description = '移动前端开发平台';

/**
 * 模块执行入口
 * 
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 */
cli.main = function ( args, opts ) {
    var label = args.join('/');
    help.show( label );
};

/**
 * 命令行配置项
 * 
 * @type {Object}
 */
exports.cli = cli;


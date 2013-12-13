/**
 * @file edpm入口
 * @author firede[firede@firede.us]
 */

var path = require( 'path' );
var log = require( './log' );
var help = require( './help' );

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
cli.command = 'mobile';

/**
 * 命令描述信息
 * 
 * @type {string}
 */
cli.description = '移动前端开发平台';

/**
 * 命令选项
 * 
 * @type {Array}
 */
cli.options = [ 'version' ];

/**
 * 模块执行入口
 * 
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 */
cli.main = function ( args, opts ) {
    // 输出版本信息
    if ( !args.length && opts.version ) {
        var pkgPath = path.resolve( __dirname, '../package.json' );
        var pkgInfo = require( pkgPath );

        log.info( 'edpm version:', log.em( pkgInfo.version ) );
    }
    else if ( args.length > 0 ) {
        log.warn( '未知命令，请检查拼写是否正确。' );
    }
    else {
        help.show( 'mobile' );
    }
};

/**
 * 命令行配置项
 * 
 * @type {Object}
 */
exports.cli = cli;

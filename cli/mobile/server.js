/**
 * @file 调试服务器模块入口
 * @author firede[firede@firede.us]
 *         junmer(junmer@foxmail.com)
 */

var path = require( 'path' );
var fs = require( 'fs' );

var extend = require( 'edp-core' ).util.extend;
var log = require( 'edp-core' ).log;

/**
 * 命令行配置项
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
cli.description = '调试服务器';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'port:',
    'config:',
    'document-root:'
];

/**
 * 默认配置文件名
 * 
 * @const
 * @type {string}
 */
var DEFAULT_CONF_FILE = 'edp-webserver-config.js';

/**
 * 模块执行入口
 * 
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 */
cli.main = function ( args, opts ) {

    var port = opts.port;
    var docRoot = opts[ 'document-root' ];
    var conf = opts.config;

    conf = loadConf( conf );

    if ( !conf ) {
        log.error( 'Cannot load server config.' );
        return;
    }

    if ( docRoot ) {
        conf.documentRoot = path.resolve( process.cwd(), docRoot );
    }

    if ( port ) {
        conf.port = port;
    }

    // 注入扩展资源处理器
    if ( conf.injectResource ) {
        var resPath = path.resolve( __dirname, '../../lib/server' );
        conf.injectResource( getExtraResource( resPath ) );
    }


    var isInstalled = require( '../../lib/util/isInstalled' );

    if (!isInstalled('weinre')) {

        log.error(
            '%s 启动失败，首次使用请用以下命令安装：\n    %s',
            'Weinre',
            'npm install -g weinre'
        );

        return;
    }


    var server = require( 'edp-webserver' );

    server.start( conf );


};

/**
 * 获取扩展资源处理器
 * 
 * @param {string} resPath 资源目录路径
 * @return {Object}
 */
function getExtraResource( resPath ) {
    var files = fs.readdirSync( resPath );
    var res = {};

    files.forEach( function( file ) {
        var filePath = path.resolve( resPath, file );
        extend( res, require( filePath ) );
    });

    return res;
}

/**
 * 加载配置文件
 * 
 * @inner
 * @param {string=} confFile 配置文件路径
 * @return {Object}
 */
function loadConf( confFile ) {
    var cwd = process.cwd();

    if ( confFile ) {
        confFile = path.resolve( cwd, confFile );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        return null;
    }

    var dir;
    var parentDir = cwd;
    do {
        dir = parentDir;
        confFile = path.resolve( dir, DEFAULT_CONF_FILE );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    return require( 'edp-webserver' ).getDefaultConfig();
}

/**
 * 命令行配置项
 * 
 * @type {Object}
 */
exports.cli = cli;

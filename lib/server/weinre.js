/**
 * @file Weinre支持
 * @author firede[firede@firede.us]
 *         junmer(junmer@foxmail.com)
 */

var core = require('edp-core');
var log = core.log;
var colorize = core.util.colorize;

/**
 * Weinre启动标记
 * 
 * @type {boolean}
 */
var isStart = false;

/**
 * 默认配置
 * 
 * @inner
 * @type {Object}
 */
var defaultOptions = {
    port: 8080,
    host: require( '../util/ip' ),
    flag: 'mobile'
};

/**
 * Weinre支持函数
 * 
 * @public
 * @param {Object} options Weinre配置
 * @param {Object.<number>} options.port Weinre端口
 * @param {Object.<string>} options.host 主机地址
 * @param {Object.<string>} options.flag 标记
 * @return {Function}
 */
exports.weinre = function( options, encoding ) {
    encoding = encoding || 'utf8';
    options = require( '../util/extend' )( defaultOptions, options );
    var clientUrl = require( 'util' ).format(
        'http://%s:%s/client/#%s',
        options.host,
        options.port,
        options.flag
    );

    return function ( context ) {
        context.stop();

        // 只在首次用到时启动
        if ( !isStart ) {
            log.info(
                '%s调试 Client 地址：',
                colorize('Weinre', 'success'),
                colorize(clientUrl, 'link')
            );
            startWeinre( options.port );
            isStart = true;
        }

        var content = context.content.toString( encoding );
        
        context.content = injectWeinreScript( content, options );
        context.start();
    };
};

/**
 * 注入Weinre脚本
 * 
 * @inner
 * @param {string} content 文件内容
 * @param {Object} options Weinre配置
 * @param {Object.<number>} options.port Weinre端口
 * @param {Object.<string>} options.host 主机地址
 * @param {Object.<string>} options.flag 标记
 * @return {string}
 */
function injectWeinreScript( content, options ) {
    var code = require( 'util' ).format(
        '<script src="http://%s:%s/target/target-script-min.js#%s"></script>',
        options.host,
        options.port,
        options.flag
    );

    return content.replace( /<\/head>/i, code + '\n</head>' );
}

/**
 * 启动Weinre进程
 * 
 * @inner
 * @param {number} port 端口号
 */
function startWeinre( port ) {

    var spawn = require( '../util/spawn' );

    var argv = [
        '--boundHost',
        '-all-',
        '--httPort',
        port
    ];

    var weinre = spawn( 'weinre', argv );

    weinre.on( 'error', function( err ) {
        log.error( 'weinre: %s', err );
        process.exit( 1 );
    });
}

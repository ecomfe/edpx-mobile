/**
 * @file 日志输出封装
 * @author firede[firede@firede.us]
 */

var chalk = require( 'chalk' );

/**
 * 获取时间
 * 
 * @inner
 * @return {string}
 */
function getTime() {
    var time = ( new Date() ).toLocaleTimeString();
    var str = chalk.bgBlack.white( time ) + ' ';

    return str;
}

/**
 * 普通日志
 * 
 * @public
 * @return {string}
 */
var log = function () {
    arguments = [].map.call( arguments, function( arg ) {
        return chalk.stripColor( arg );
    });
    arguments[ 0 ] = getTime() + chalk.gray( arguments[ 0 ] );

    return console.log.apply( this, arguments );
};

/**
 * 错误
 * 
 * @public
 * @return {string}
 */
log.error = function () {
    arguments[ 0 ] = chalk.red( '[ERROR] ' ) + arguments[ 0 ];
    return console.error.apply( this, arguments );
};

/**
 * 警告
 * 
 * @public
 * @return {string}
 */
log.warn = function () {
    arguments[ 0 ] = chalk.yellow( '[WARN] ' ) + arguments[ 0 ];
    return console.warn.apply( this, arguments );
};

/**
 * 信息
 * 
 * @public
 * @return {string}
 */
log.info = function () {
    arguments[ 0 ] = chalk.green( '[INFO] ' ) + arguments[ 0 ];
    return console.info.apply( this, arguments );
};

/**
 * 重点部分
 * 
 * @public
 * @type {string}
 */
log.em = chalk.green;

/**
 * 路径或链接
 * 
 * @public
 * @desc 主要用于标记可以 command + 单击 直接访问的地址
 * @type {string}
 */
log.path = chalk.blue.underline;

/**
 * 代码
 * 
 * @public
 * @type {string}
 */
log.code = chalk.cyan;

module.exports = log;
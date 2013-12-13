/**
 * @file 命令行工具入口
 * @author firede[firede@firede.us]
 */

var spawn = require( 'child_process' ).spawn;
var log = require( './log' );

/**
 * 执行edpm
 * 
 * @public
 */
exports.execute = function( argv, cwd, env ) {
    // 输入参数处理
    argv.splice( 0, 2, 'mobile' );

    var edp = spawn( 'edp', argv, {
        cwd: cwd,
        env: env,
        stdio: 'inherit'
    } );

    edp.on( 'close', function( code ) {
        if ( code !== 0 ) {
            errorReport();
        }
    } );

};

/**
 * 向屏幕输出错误报告信息
 */
function errorReport() {
    var msg = 'edpm 非正常退出，如果你觉得像 bug，请将出错信息发给我们：';
    var url = 'https://github.com/ecomfe/edpx-mobile/issues/new';

    log.error( msg + '\n' + log.path(url) );
}

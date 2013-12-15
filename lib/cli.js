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
exports.execute = function( argv, cwd ) {
    // 输入参数处理
    argv.splice( 0, 2, 'mobile' );

    var edp = spawn( 'edp', argv, {
        cwd: cwd,
        stdio: 'inherit'
    } );

    edp.on( 'error', function( err ) {
        log.error( err );
        log.error(
            log.em( 'edp' ),
            '启动失败，首次使用请用以下命令安装：'
        );
        log.error( 'npm install -g edp' );
    });

    edp.on( 'close', function( code ) {
        if ( code !== 0 ) {
            issueReport();
        }
    } );
};

/**
 * 向屏幕输出错误报告信息
 */
function issueReport() {
    log.error(
        log.em( 'edpm' ),
        '非正常退出，如果你觉得像 bug，请给我们提 issue：'
    );
    log.error(
        log.path( 'https://github.com/ecomfe/edpx-mobile/issues/new' )
    );
}

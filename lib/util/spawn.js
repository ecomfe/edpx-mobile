/**
 * @file 执行外部命令
 * @author firede[firede@firede.us]
 */

var spawn = require( 'child_process' ).spawn;
var extend = require( './extend' );

module.exports = function ( command, args, opts ) {
    var winCmd = process.env.comspec;
    var osCommand = winCmd ? winCmd : command;
    var osArgs = winCmd ? [ '/c' ].concat( command, args ) : args;
    opts = opts || {};
    
    return spawn(
        osCommand,
        osArgs,
        extend({
            stdio: 'inherit',
            cwd: process.cwd()
        }, opts)
    );
};

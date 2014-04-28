/**
 * 判断是否已经安装
 * 
 * @return {boolean}
 */

module.exports = function( pkg ) {
    var fs = require( 'fs' );
    var path = require( 'path' );

    var d1 = path.join( __dirname, '..', '..', 'node_modules', pkg );
    var d2 = path.resolve( __dirname, '..', '..', '..', pkg );

    return fs.existsSync( d1 ) || fs.existsSync( d2 );
};
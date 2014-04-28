/**
 * 判断是否已经安装
 * 
 * @return {boolean}
 */

module.exports = function( pkg ) {

    var fs = require( 'fs' );
    var path = require( 'path' );

    var Deferred = require( 'edp-core' ).Deferred;


    var deff = new Deferred();

    var d1 = path.join( __dirname, '..', '..', 'node_modules', pkg );
    var d2 = path.resolve( __dirname, '..', '..', '..', pkg );

    var hasRelative = fs.existsSync( d1 ) || fs.existsSync( d2 );

    if (hasRelative) {
        deff.resolve();
        return deff;
    }

    var npm = require( './spawn' )( 'npm', [ 'root', '-g' ], {
        stdio: 'ignore'
    } );

    npm.on('data', function (data) {
        if (fs.existsSync(data)) {
            deff.resolve();
            return;
        }
        deff.reject();
    });

    npm.on( 'close', function( code ){

        if ( code !== 0 ) {
            deff.reject();
            return;
        }

        deff.resolve();

    });


    return deff;
};
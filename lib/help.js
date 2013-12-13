/**
 * @file 帮助模块
 * @author firede[firede@firede.us]
 */

var fs = require( 'fs' );
var path = require( 'path' );
var msee = require( 'msee' );

/**
 * 用于非help命令时显示帮助
 * 
 * @public
 * @param {string} label 模块帮助的标记
 */
exports.show = function( label ) {
    var filePath = getValidPath( label );

    if ( !filePath ) {
        filePath = getFullPath( 'mobile' );
    }

    var result = msee.parseFile( filePath );

    console.log( result );
};

/**
 * 获取有效路径
 * 
 * @inner
 * @param {string} label 模块帮助的标记
 * @return {string|null} 有效路径或null
 */
function getValidPath( label ) {
    var filePath = getFullPath( label );
    
    if ( fs.existsSync( filePath ) ) {
        return filePath;
    }

    var index = label.lastIndexOf( '/' );

    if ( index !== -1 ) {
        label = label.slice( 0, index );
        return getValidPath( label );
    }

    return null;
}

/**
 * 获取完整路径
 * 
 * @inner
 * @param {string} label 模块帮助的标记
 * @return {string} 完整路径
 */
function getFullPath( label ) {
    return path.resolve( __dirname, '../doc/cli', label + '.md' );
}

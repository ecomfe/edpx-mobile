/**
 * @file 文件移动
 * @author treelite(c.xinle@gmail.com)
 */

var isWin = require('os').platform().indexOf('win') === 0;
var command = isWin ? 'move' : 'mv';
var cmdOpts = isWin ? {stdio: 'ignore'} : {};
var exec = require('./exec');

/**
 * 移动文件
 *
 * @public
 * @param {string} source 源文件路径
 * @param {string} target 目标件路径
 * @return {Promise}
 */
module.exports = function (source, target) {
    var cmd = [command, source, target];
    return exec(cmd.join(' '), cmdOpts);
};

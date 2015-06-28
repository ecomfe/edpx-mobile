/**
 * @file 文件夹拷贝
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var isWin = require('os').platform().indexOf('win') === 0;
var cmdOpts = isWin ? {stdio: 'ignore'} : {};
var exec = require('./exec');

/**
 * 文件夹拷贝
 *
 * @param {string} source 源文件夹
 * @param {string} dest 目标文件夹
 * @return {Promise}
 */
module.exports = function (source, dest) {
    var cmd;
    var options;

    var stats = fs.statSync(source);
    if (stats.isDirectory()) {
        if (isWin) {
            cmd = ['xcopy', source, dest, '/e', '/i'];
        }
        else {
            cmd = ['cp', '-r', source, dest];
        }
    }
    else {
        cmd = [isWin ? 'copy' : 'cp'];
        cmd = cmd.concat([source, dest]);
    }

    return exec(cmd.join(' '), cmdOpts);
};

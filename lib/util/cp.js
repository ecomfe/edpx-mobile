/**
 * @file 文件夹拷贝
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var isWin = require('os').platform().indexOf('win') === 0;
var command = isWin ? 'xcopy' : 'cp';
var exec = require('./exec');

/**
 * 文件夹拷贝
 *
 * @param {string} source 源文件夹
 * @param {string} dest 目标文件夹
 * @return {Promise}
 */
module.exports = function (source, dest) {
    var cmd = [command];

    var stats = fs.statSync(source);
    if (stats.isDirectory() && !isWin) {
        cmd.push('-r');
    }

    cmd = cmd.concat([source, dest]);

    return exec(cmd.join(' '));
};

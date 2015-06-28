/**
 * @file 执行外部命令
 * @author treelite(c.xinle@gmail.com)
 */

var Deferred = require('edp-core').Deferred;
var spawn = require('./spawn');

/**
 * 执行外部命令
 *
 * @public
 * @param {string} cmd 外部命令
 * @param {Object=} options 配置参数
 * @return {Promise}
 */
module.exports = function (cmd, options) {
    cmd = cmd.split(/\s+/);
    var args = cmd.slice(1);
    cmd = cmd[0];

    var deferred = new Deferred();
    var child = spawn(cmd, args, options);

    child.on('exit', function (code) {
        if (!code && code !== null) {
            deferred.resolve();
        }
        else {
            deferred.reject(code);
        }
    });

    return deferred.promise;
};

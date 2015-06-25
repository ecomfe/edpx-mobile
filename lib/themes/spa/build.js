/**
 * @file 项目构建
 * @author treelite(c.xinle@gmail.com)
 */

var Deferred = require('edp-core').Deferred;
var spawn = require('../../util/spawn');

/**
 * 项目构建
 * 简单调用 `edp build`
 *
 * @public
 * @param {Object} options 命令行参数
 * @return {Promise}
 */
module.exports = function (options) {
    var deferred = new Deferred();
    var args = ['build'];

    if (options.force) {
        args.push('-f');
    }

    var cmd = spawn('edp', args);
    cmd.on('close', function (code) {
        if (!code) {
            deferred.resolve();
        }
        else {
            deferred.reject();
        }
    });

    return deferred.promise;
};

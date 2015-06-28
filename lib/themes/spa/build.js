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
 * @param {boolean=} options.force 是否强制进行构建
 * @param {string=} options.stage 构建场景
 * @param {string=} options.config 配置文件
 * @return {Promise}
 */
module.exports = function (options) {
    var deferred = new Deferred();
    var args = ['build'];

    if (options.force) {
        args.push('-f');
    }

    if (options.stage) {
        args.push('--stage=' + options.stage);
    }

    if (options.config) {
        args.push('--config=' + options.config);
    }

    var cmd = spawn('edp', args);
    cmd.on('exit', function (code) {
        if (!code && code !== null) {
            deferred.resolve();
        }
        else {
            deferred.reject();
        }
    });

    return deferred.promise;
};

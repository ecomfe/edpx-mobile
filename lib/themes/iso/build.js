/**
 * @file build
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var extend = require('../../util/extend');
var Deferred = require('edp-core').Deferred;
var log = require('edp-core').log;
var rmdir = require('edp-core').util.rmdir;

/**
 * 默认的构建配置文件
 *
 * @const
 * @type {string}
 */
var BUILD_CONFIG = 'edp-build-config.js';

/**
 * 项目根目录
 *
 * @const
 * @type {string}
 */
var BASE_DIR = require('edp-project').getInfo().dir;

/**
 * rebas项目默认构建配置信息
 *
 * @const
 * @type {Object}
 */
var REBAS_CONFIG = {
    // 输出的目录
    output: 'output/node',
    // 需要拷贝到输出目录的文件
    files: ['app.js', 'lib', 'node_modules'],
    // 主文件
    index: 'index.html',
    // 配置文件夹
    configDir: 'config'
};

/**
 * 构建前端代码
 *
 * @param {Object} options 构建参数
 * @param {boolean=} options.force 是否强制进行构建
 * @param {string=} options.stage 构建场景
 * @param {string=} options.config 配置文件
 * @return {Promise}
 */
function build4Browser(options) {
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

    var spawn = require('../../util/spawn');

    log.info('start building static ...');

    var cmd = spawn('edp', args);

    cmd.on('exit', function (code) {
        if (!code && code !== null) {
            log.info('build static success');
            deferred.resolve();
        }
        else {
            log.error('build static fail ...');
            deferred.reject();
        }
    });

    return deferred.promise;
}



/**
 * 构建node代码
 *
 * @param {Object} options 构建参数
 * @param {string} options.stage 构建场景
 * @param {Object} config 项目的构建配置信息
 * @return {Promise}
 */
function build4Node(options, config) {
    var cp = require('../../util/cp');
    var mv = require('../../util/mv');
    var info = extend({}, REBAS_CONFIG, config.rebas);
    var output = path.resolve(BASE_DIR, info.output);

    if (fs.existsSync(output)) {
        if (options.force) {
            rmdir(output);
        }
        else {
            log.error(output + ' directory already exists!');
            return Deferred.rejected();
        }
    }
    require('mkdirp').sync(output);

    log.info('start building node ...');

    /**
     * 处理需要拷贝的文件
     *
     * @return {Promise}
     */
    function handleFiles() {
        var tasks = [];
        var files = info.files;

        log.info('copy files ...');

        files.forEach(function (file) {
            tasks.push(cp(path.resolve(BASE_DIR, file), path.resolve(output, file)));
        });

        return Deferred.all(tasks);
    }

    /**
     * 处理配置文件夹
     *
     * @return {Promise}
     */
    function handleConfig() {
        var dir = info.configDir;
        var stage = options.stage;
        stage = stage ? '-' + stage : '';

        log.info('copy config dir ...');

        return cp(path.resolve(BASE_DIR, dir + stage), path.resolve(output, dir));
    }

    /**
     * 处理主页面
     *
     * @return {Promise}
     */
    function handleIndexFile() {
        var file = info.index;

        log.info('handle index file ...');

        // 从前端编译结果中获取主文件
        var source = path.resolve(config.output, file);
        var target = path.resolve(output, file);

        return mv(source, target);
    }

    return handleFiles()
        .then(handleConfig)
        .then(handleIndexFile)
        .then(
            function () {
                log.info('build node success');
            },
            function () {
                log.error('build node fail ...');
                return Deferred.rejected();
            }
        );

}

/**
 * 项目构建
 *
 * @public
 * @param {Object} options 构建参数
 * @param {boolean=} options.force 是否强制进行构建
 * @param {string=} options.stage 构建场景
 * @param {string=} options.config 配置文件
 * @return {Promise}
 */
module.exports = function (options) {
    var configFile = options.config;

    if (!configFile) {
        configFile = path.resolve(BASE_DIR, BUILD_CONFIG);
    }
    else {
        configFile = path.resolve(process.cwd(), configFile);
    }

    var config;

    try {
        config = require(configFile);
    }
    catch (e) {
        log.error(e);
        log.error('parse config fail: ' + configFile);
        return Deferred.rejected();
    }

    return build4Browser(options)
            .then(build4Node.bind(null, options, config));
};

/**
 * @file 调试模块入口
 * @author firede[firede@firede.us]
 *         junmer(junmer@foxmail.com)
 */

var path = require('path');
var fs = require('fs');

var extend = require('edp-core').util.extend;
var log = require('edp-core').log;
var spawn = require('../../lib/util/spawn');

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '启动调试服务器';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'port:',
    'document-root:',
    'config:'
];

/**
 * 模块执行入口
 *
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 */
cli.main = function (args, opts) {

    // 多命令 使用默认配置

    var cmds = ['server', 'watch'];
    var userCmds = cmds.filter(function (cmd) {
        return args.indexOf(cmd) > -1;
    }).length;

    if (userCmds > 1 || userCmds === 0) {
        startServer([], opts);
        spawn('edp', ['watch']);
    }

    // 单命令 分别处理

    var cmd = args[0];
    var argv = args.slice(1);

    if (cmd === 'server') {
        startServer(argv, opts);
    }
    else if (cmd === 'watch') {
        spawn('edp', args);
    }

};

/**
 * 启动server
 *
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 */
function startServer(args, opts) {

    var isInstalled = require('../../lib/util/isInstalled');

    var pkg = 'weinre';

    isInstalled(pkg).then(
        startWs,
        function () {
            require('edp-core').pkg.install(pkg).then(
                startWs,
                function () {
                    log.error(pkg + '安装失败, 请重试或手动安装：\n npm install -g ' + pkg);
                }
            );
        }
   );

    /**
     * 开始
     */
    function startWs() {
        var conf = gerServerConfig(opts);
        require('edp-webserver').start(conf);

        var theme = require('../../lib/metadata').get('theme');
        // 如果是同构的项目需要再启动node
        if (theme === 'iso') {
            // TODO
            // 考虑使用能热reload的方式启动测试服务器
            spawn('node', ['app.js']);
        }
    }
}


/**
 * 获取webserver 配置
 *
 * @param {Object} opts cli配置
 * @return {Object}
 */
function gerServerConfig(opts) {

    var port = opts.port;
    var docRoot = opts['document-root'];
    var conf = opts.config;

    conf = loadConf(conf);

    if (!conf) {
        log.error('Cannot load server config.');
        return;
    }

    if (docRoot) {
        conf.documentRoot = path.resolve(process.cwd(), docRoot);
    }

    if (port) {
        conf.port = port;
    }

    // 注入扩展资源处理器
    if (conf.injectResource) {
        var resPath = path.resolve(__dirname, '../../lib/server');
        conf.injectResource(getExtraResource(resPath));
    }

    return conf;
}

/**
 * 获取扩展资源处理器
 *
 * @param {string} resPath 资源目录路径
 * @return {Object}
 */
function getExtraResource(resPath) {
    var files = fs.readdirSync(resPath);
    var res = {};

    files.forEach(function (file) {
        var filePath = path.resolve(resPath, file);
        extend(res, require(filePath));
    });

    return res;
}

/**
 * require with try catch
 *
 * @param  {string} mod modname
 * @return {any}     mod
 */
function requireSafely(mod) {
    try {
        return require(mod);
    }
    catch (e) {
        log.error(e);
        return;
    }
}

/**
 * 加载配置文件
 *
 * @inner
 * @param {string=} confFile 配置文件路径
 * @return {Object}
 */
function loadConf(confFile) {
    var cwd = process.cwd();

    var DEFAULT_CONF_FILE = 'edp-webserver-config.js';

    if (confFile) {
        confFile = path.resolve(cwd, confFile);
        if (fs.existsSync(confFile)) {
            return requireSafely(confFile);
        }

        return null;
    }

    var dir;
    var parentDir = cwd;
    do {
        dir = parentDir;
        confFile = path.resolve(dir, DEFAULT_CONF_FILE);
        if (fs.existsSync(confFile)) {
            return requireSafely(confFile);
        }

        parentDir = path.resolve(dir, '..');
    } while (parentDir !== dir);

    return require('edp-webserver').getDefaultConfig();
}


/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

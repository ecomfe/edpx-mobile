/**
 * @file Isomorph init
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var scaffold = require('../../scaffold');
var importDep = require('../../util/import-dependence');
var getLoaderInfo = require('../../util/get-loader-info');
var router = require('./router');

var npmPackages = [
    'rebas',
    'saber-ajax',
    'saber-lang',
    'saber-mm',
    'saber-promise'
];

var npmPackagesDev = [
    'rider-ui',
    'edp-provider-rider',
    'rebas-transfer'
];

var edpPackages = [
    'saber-firework',
    'saber-ajax',
    'saber-rainbow'
];

/**
 * 空函数
 */
function blank() {}

/**
 * 生成配置文件
 *
 * @param {string} root 项目根目录
 */
function generateConfig(root) {
    var logConfig = {
        console: true
    };

    var appConfig = {
        port: 8000,
        remote: '',
        staticRoot: 'src',
        root: ''
    };

    function make(dir) {
        dir = path.resolve(root, dir);
        mkdirp.sync(dir);
        fs.writeFileSync(path.resolve(dir, 'app.json'), JSON.stringify(appConfig, null, 4));
        fs.writeFileSync(path.resolve(dir, 'log.json'), JSON.stringify(logConfig, null, 4));
    }

    // config
    make('config');

    // 针对联调环境与生产环境修改配置
    appConfig.staticRoot = 'asset';
    logConfig.console = false;

    // config-dev
    make('config-dev');

    // config-release
    make('config-release');
}

/**
 * 生成文件
 *
 * @param {Object} projectInfo 项目信息
 */
function generateFiles(projectInfo) {
    var dir = projectInfo.dir;

    function create(name, tpl, data) {
        var file = path.resolve(dir, name);
        scaffold.generate(tpl, file, data);
    }

    // 创建lib目录
    mkdirp.sync(path.resolve(dir, 'lib'));


    // 生成 index.html
    create('index.html', 'iso/index', {loader: getLoaderInfo(path.resolve(dir, 'index.html'))});

    // 生成edp-webserver-config.js
    create('edp-webserver-config.js', 'iso/webserver-config');

    // 生成edp-build-config.js
    create('edp-build-config.js', 'iso/build-config');

    // 生成edp-watch-config.js
    create('edp-watch-config.js', 'iso/watch-config');

    // 生成rider-config.js
    create('edp-rider-config.js', 'iso/rider-config');

    // 生成src/app.js
    create('src/app.js', 'iso/browser-app');

    // 生成src/boot.js
    create('src/boot.js', 'iso/browser-boot');

    // 生成src/app.js
    create('app.js', 'iso/node-app');

    // 生成配置文件
    generateConfig(dir);

    // 生成路由配置文件
    router.create();
}

/**
 * 初始化同构项目
 *
 * @param {Object} projectInfo 项目信息
 * @param {Function=} callback 初始化完成回调函数
 */
module.exports = function (projectInfo, callback) {
    callback = callback || blank;

    importDep.npm(npmPackages, ['--save'], function () {
        importDep.npm(npmPackagesDev, ['--save-dev'], function () {
            importDep.edp(edpPackages, function () {
                generateFiles(projectInfo);
                callback();
            });
        });
    });

};

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
var readJSONFile = require('edp-core').util.readJSONFile;

/**
 * 生成配置文件
 *
 * @param {string} root 项目根目录
 */
function generateConfig(root) {
    var config = scaffold.getConfig('iso/config');

    function make(dir, data) {
        dir = path.resolve(root, dir);
        mkdirp.sync(dir);
        Object.keys(data).forEach(function (file) {
            var item = data[file];
            fs.writeFileSync(path.resolve(dir, file + '.json'), JSON.stringify(item, null, 4));
        });
    }

    Object.keys(config).forEach(function (dir) {
        make(dir, config[dir]);
    });
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

    // 修改module.conf 文件
    // 增加 combine 设置
    var file = path.resolve(dir, 'module.conf');
    var moduleConfig = readJSONFile(file);
    moduleConfig.combine = moduleConfig.combine || {};
    moduleConfig.combine.app = true;
    moduleConfig.combine.boot = true;
    fs.writeFileSync(
        file,
        JSON.stringify(moduleConfig, null, 4),
        'utf-8'
    );
}

/**
 * 初始化同构项目
 *
 * @param {Object} projectInfo 项目信息
 * @return {Promise}
 */
module.exports = function (projectInfo) {
    var pkgs = scaffold.getConfig('iso/packages');
    return importDep.npm(pkgs.npm.dependencies, ['--save'])
        .then(importDep.npm.bind(importDep, pkgs.npm.devDependencies, ['--save-dev']))
        .then(importDep.edp.bind(importDep, pkgs.edp.dependencies))
        .then(generateFiles.bind(null, projectInfo));
};

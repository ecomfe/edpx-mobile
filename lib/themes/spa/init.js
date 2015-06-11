/**
 * @file spa init
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var router = require('./router');
var scaffold = require('../../scaffold');
var importDep = require('../../util/import-dependence');
var getLoaderInfo = require('../../util/get-loader-info');
var readJSONFile = require('edp-core').util.readJSONFile;

/**
 * 生成默认文件
 *
 * @inner
 * @param {Object} projectInfo 项目信息
 */
function generateFiles(projectInfo) {
    var dir = projectInfo.dir;

    function create(name, tpl, data) {
        var file = path.resolve(dir, name);
        scaffold.generate(tpl, file, data);
    }

    // 生成 index.html
    create('index.html', 'spa/index', {loader: getLoaderInfo(path.resolve(dir, 'index.html'))});

    // 生成edp-webserver-config.js
    create('edp-webserver-config.js', 'spa/webserver-config');

    // 生成edp-build-config.js
    create('edp-build-config.js', 'spa/build-config');

    // 生成edp-watch-config.js
    create('edp-watch-config.js', 'spa/watch-config');

    // 生成rider-config.js
    create('edp-rider-config.js', 'spa/rider-config');

    // 生成src/app.js
    create('src/app.js', 'spa/app');

    // 生成路由配置文件
    router.create();

    // 更新module.conf
    // 添加默认的combine选项
    var file = path.resolve(dir, 'module.conf');
    var moduleConfig = readJSONFile(file);
    moduleConfig.combine = moduleConfig.combine || {};
    moduleConfig.combine.app = true;
    fs.writeFileSync(
        file,
        JSON.stringify(moduleConfig, null, 4),
        'utf-8'
    );
}

/**
 * 初始化SPA项目
 *
 * @param {Object} projectInfo 项目信息
 * @return {Promise}
 */
module.exports = function (projectInfo) {
    var pkgs = scaffold.getConfig('spa/packages');
    return importDep.npm(pkgs.npm.devDependencies, ['--save-dev'])
        .then(importDep.edp.bind(importDep, pkgs.edp.dependencies))
        .then(generateFiles.bind(null, projectInfo));
};

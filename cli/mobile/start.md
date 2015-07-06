# 调试

## server

    edpm start server
    edpm start server [--port=portNo]
    edpm start server [--config=configFile]
    edpm start server [--document-root=documentRoot]
    edpm start server [--stage=stageStr]

### Description

基本用法与配置文件写法和 `edp` 的 `webserver` 相同。
与之相比，增加了一些移动端常用的 **资源处理器**。

### 远程调试

启用 Weinre 远程调试工具，开启后可在电脑上远程调试移动设备浏览器。
只会启动一个 `weinre` 进程，若在多出使用 `weinre` 处理器，配置请保持一致。

Weinre 官方文档：http://people.apache.org/~pmuellr/weinre/docs/latest/

#### weinre( options )

+ options.host - 可被访问的主机名，默认为本机IP
+ options.port - Weinre 端口号，默认为 `8080`
+ options.flag - Weinre 标记，默认为 `mobile`

如无特殊需要，推荐使用默认参数。

#### 配置示例

```javascript
exports.getLocations = function () {
    return [
        {
            location: /\.(html|htm|phtml|tpl|vm)($|\?)/,
            handler: [
                file(),
                weinre()
            ]
        },
        // others...
    ]
};
```

#### Reference

    edp webserver --help


## watch

    edpm start watch
    edpm start watch [task-group]
    edpm start watch [task-group] [--config=confFile]

### Description

基本用法与配置文件写法和 `edp` 的 `watch` 相同。
常用 `liveroad`

#### 配置示例

```
exports.baseDir = __dirname;

var globalFilters = {
    ignoreNodeModules: '!(node_modules/*|*/node_modules/*)',
    ignoreEdpPackages: '!dep/*',
    ignoreVCSFiles   : '!(*).(git|svn|idea)/*',
    ignoreIDEFiles   : '!(*).(DS_Store)',
    ignoreNodeConfig : '!(*)(.gitignore|packkage.json|*.md)'
};

var commonFilters = {
    staticFiles: '*.(tpl|html|js|coffee|less|styl|css|xml)',
    mediaFiles: '*.(gif|jpg|jpeg|png|swf|fla|mp3)'
};

exports.globalFilters = globalFilters;

exports.getTasks = function () {
    return {
        'livereload': {
            filters: [
                commonFilters.staticFiles,
                commonFilters.staticFiles
            ],
            events: [
                'addedFiles',
                'modifiedFiles'
            ],
            plugins: livereload(),
            intervalTime: 3000
        }
    };
};

exports.getGroups = function () {
    return {
        'default': [ 'livereload' ]
    };
};

exports.injectPlugin = function (plugins) {
    for (var key in plugins) {
        global[key] = plugins[key];
    }
};
```



#### Reference

    edp watch --help

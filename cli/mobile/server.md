# 调试服务器

## Usage

    edpm server
    edpm server [--port=portNo]
    edpm server [--config=configFile]
    edpm server [--document-root=documentRoot]

## Description

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

## Reference

    edp help webserver

edpx-mobile
===

[![NPM version](https://img.shields.io/npm/v/edpx-mobile.svg?style=flat-square)](https://npmjs.org/package/edpx-mobile) [![License](https://img.shields.io/npm/l/edpx-mobile.svg?style=flat-square)](./LICENSE) [![EFE Mobile Team](https://img.shields.io/badge/EFE-Mobile_Team-blue.svg?style=flat-square)](http://efe.baidu.com)

EDP extension for Mobile project.

专注于移动开发的 [edp](https://github.com/ecomfe/edp) 扩展，为您提供最佳的 [Fate](http://ecomfe.github.io/fate) 开发体验

## Installation

不用特殊安装，第一次使用 `edpx-mobile` 提供的功能时 `edp` 会自动安装该插件，如果想提前手动安装的话请使用以下方法：

```sh
$ npm install -g edpx-mobile
```

## CLI

### init &lt;theme&gt;

初始化项目，会完成项目目录结构的初始化，导入所有依赖的模块并且生成基础代码。主题参数 `theme` 表明生成哪种类型的项目，有以下取值：

* `spa` 单页应用
* `iso` 同构应用

```sh
# 初始化同构的项目
$ edp mobile init iso
```

### add [type] &lt;path&gt; [file_name_prefix]

添加业务，会为 `path` （是以 `/` 开头的有效 URL 路径）指定的路径添加相应的 Presenter、View、Model、Template 与 Style 文件，比如：

```sh
$edp mobile add /
```

会添加处理 `/` 路径的相关文件，并且以 `path` 为基础来命名文件，比如此时 Presenter 为 `index.js`，Model 为 `indexModel.js`

也可以通过指定 `type` 来单独添加某一类文件，`type` 的有效取值如下：

* `presenter` 添加 Presenter 文件，同时会自动往路由配置信息文件中添加对应的路由信息
* `view` 添加 View 文件
* `model` 添加 Model 文件
* `template` 添加模版文件文件
* `style` 添加样式文件

还也可以使用 `file_name_prefix` 指定生成的文件名前缀，比如：

```sh
$ edp mobile add /detail/:id product/detail
```

以上命令会生成处理 `/detail/:id` 路径的相关文件并且以 `file_name_prefix` 指定的名称作为文件名前缀，比如此时 Presenter 为 `product/detail.js`，Model 为 `product/detailModel.js`

生成文件的具体路径由当前项目的主题决定，如果是 `spa` 单页面应用，则所有生成的文件都在 `src` 目录下，而如果是 `iso` 同构项目则 `lib` 与 `src` 文件夹下都会新增文件，所以在指定 `file_name_prefix` 时不需要写 `src` 或者 `lib` 文件夹名

### start

启动测试服务器，第一次启动测试服务器时会先安装缺失的依赖，所以可能会有些慢，稍安去燥，正好起身喝杯茶～ （这里的“第一次”是对系统而言的哟，所以你可能有且只有一次机会能去喝杯茶 :) ）

```sh
$ edp mobile start
```

自测服务器的相关配置在 `edp-webserver-config.js` 中，详细配置信息[请参考这里](https://github.com/ecomfe/edp/wiki/WebServer)。在自测服务器中我们集成了 `Weinre` 与 `livereload` 功能，方便移动端的调试，并且对于 `iso` 同构的项目默认启动了代码监控与自动重启，在修改了 JavaScript、模版文件或者 JSON 配置信息后都无需手动重启服务～

## More

`edpx-mobile` 目前只提供了 `init`、`add` 与 `start` 三条命令，并不能独立的完全覆盖开发的方方面面，剩下的部分我们认为 `edp` 已经完成得很贴心了，所以就请直接使用 `edp` 提供的相关功能，比如说项目构建 `edp build`，具体请参考详细的 [edp 文档](https://github.com/ecomfe/edp/wiki)。当然，如果感觉某些 `edp` 或者 `edpx-mobile` 提供的功能不好用、不符合预期，请[告诉我们](https://github.com/ecomfe/edpx-mobile/issues/new)或者直接给我们提交 PR ～

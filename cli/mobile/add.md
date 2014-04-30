## add

### Usage

    edpm add <path>

### Description

根据当前项目的主题添加模块

`spa`项目支持以下命令形式：

* `edpm add <path>` 添加完整的模块并注册路由信息，文件路径默认以`path`为准，包括Action、View、Model与template
* `edpm add <path> <file>` 添加完整模块、注册路由信息并指定文件路径，用于`path`与实际文件路径不统一的情况，比如`edpm add /detail/:id ./detail`
* `edpm add action <path>` 注册路由信息并在`src`目录下添加`Action`文件
* `edpm add view <path>` 在`src`目录下添加`View`文件
* `edpm add model <path>` 在`src`目录下添加`Model`文件
* `edpm add template <path>` 在`src`目录下添加`template`文件

__注：__如果是以`'/'`结尾的`path`自动扩展为包含`index`文件的形式，比如`edpm add /`实际注册路由信息的`path`为`/index`，生成的实际文件为`src/index.js`、`src/indexModel.js`、`src/indexView.js`和`src/index.tpl`

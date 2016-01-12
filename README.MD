# App

Aimee框架的app模块，所有Widget App组件依赖此模块创建  

#### 目录结构
```
// widget.app由数个基本文件组成
nav
├── nav.jade            // 可选，app的jade模板，构建过程中会被编译成amd模块
├── nav.js              // 可选，app功能js文件
├── nav.json.js         // 可选，app模拟数据，基于mock规则，仅用于测试
├── nav.less            // 可选，app的样式文件
├── aimee.json          // 必须，app描述文件
├──                     // 可选，app的其他文件，会被构建工具过滤
└── img                 // 可选，app的媒体文件夹
```

#### 创建标准App模板
请安装[包管理](https://www.npmjs.com/package/aimee-cli)工具，包管理工具自带脚手架哦
```js
$ aimee c -w app
// or
$ aimee create -w app
```

#### 安装
```js
$ aimee i app
// or
$ aimee install app
```

#### 卸载
```js
$ aimee r app
// or
$ aimee remove app
```

#### 更新
```js
$ aimee u app
// or
$ aimee update app
```

#### 定义标准 Widget App
以当前App为父类创建的app，具有统一接口，方便被认可的框架所调用
```js
var app, App;

App = require('app');
app = App.create({
    name: 'nav',
    version: '1.0.0',
    template: require('./nav.jade'),

    // app渲染到页面之前执行，用于预处理渲染内容
    prerender: function(app){
        // app为模块的实例
        app.find('li').eq(0).addClass('selected');
    },

    // app渲染到页面之后执行，此时app还在内存中，不能获取宽度高度等与尺寸相关的属性
    postrender: function(app){
        // app为模块的实例
    },

    // 页面渲染到浏览器后执行，此时可以获取宽高等与尺寸相关的属性
    pagerender: function(app){
        // some code
    }
});

module.exports = app;
```

#### 定义普通App
任意你熟悉的方式，可以是一个css文件，可以是js功能文件，也可以是一段jade模板  
```js
// eg 1
// 自启动，注册即执行，不需要对外暴露接口
// 构建工具UZ会对js模块进行包装，所有变量定义都将是局部变量，所以不用担心变量污染全局
var innerWdith = window.innerWdith;
console.log(innerWdith)
```

对外开放接口请使用```exports.test = test``` 或 ```module.exports = test```
```js
// eg 2
// 需要对外暴露接口
var innerWdith = window.innerWdith;
var foo = {
    bar: function(){
        console.log(innerWdith)
    }
}
module.exports = foo;
```

```js
// eg 3
// 需要对外暴露接口
exports.foo = function(){
    console.log('foo')
}

exports.bar = function(){
    console.log('bar')
}
```


#### 调用 App 的通用方式
```js
var App = require('app');
var app = new App;
app.foo();
```

#### 在 [Page](http://aimee.ilinco.com/static/sage/?name=page&version=1.0.6#/app) 中调用 Widget App
```js
var App = require('app');
var app = new App;
app.init(data).render();
```
或者通过Page内置方法进行调用
```js
// Or 无需数据
page.exports('app');

// Or 需要数据
page.exports('app', data);

// Or 需要逻辑开发
page.exports('app', function(app){
    app.init(data).render();
    app.find('h1').on('click', app.foo)
});
```

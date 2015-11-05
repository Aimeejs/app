# app

Aimee框架的app模块，所有组件依赖此模块创建


```
// widget.app由4个基本文件组成
nav
├── nav.jade 			// app的jade模板，构建过程中会被编译成amd模块
├── nav.js 				// app功能js文件
├── nav.json.js 		// app模拟数据，基于mock规则，仅用于测试
├── nav.less 			// app的样式文件
└── img 				// app的图片文件夹
```

```
// 基本使用，定义一个 widget.app
var app, App;

App = require('app');
app = App.create({
	name: 'nav',
	version: '1.0.0',
	template: require('./nav.jade')
});

module.exports = app;
```


```
// 高级使用，定义一个 widget.app
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

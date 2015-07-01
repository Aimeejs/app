# Aimee-app

----
UZ构建工具app模块，用于生成Aimee Widget的基类，依赖[Zepto](http://www.zeptojs.cn/) or [jQuery v2+](http://jquery.com/)，可选依赖[mock.js](http://mockjs.com/)，mockjs仅用于开发环境


```
// Aimee-widget由4个基本文件组成
nav
├── nav.jade 			// app的jade模板，构建过程中会被编译成amd模块
├── nav.js 				// app功能js文件
├── nav.json.js 		// app模拟数据，基于mock规则，仅用于测试
├── nav.less 			// app的样式文件
└── img 				// app的图片文件夹
```

```
// 基本使用，定义一个 Aimee-widget
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
// 高级使用，定义一个 Aimee-widget
var app, App;

App = require('app');
app = App.create({
	name: 'nav',
	version: '1.0.0',
	template: require('./nav.jade'),

	// app渲染到页面之前执行，用于预处理渲染内容
	prerender: function(thisApp){
		// thisApp 当前模块的jQuery对象
		thisApp.find('li').eq(0).addClass('selected');
	},

	// app渲染到页面之后执行
	postrender: function(thisApp){
		// thisApp 当前模块的jQuery对象
	}
});

// app渲染之前触发，类似于prerender方法
app.fn.on('before', function(thisApp){
	// your code
});

// app渲染之后触发，类似于postrender方法
app.fn.on('after', function(thisApp){
	// your code
});

module.exports = app;
```

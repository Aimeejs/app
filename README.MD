# Aimee-app

----
UZ构建工具app模块，用于生成Aimee-app的类，依赖[Zepto](http://www.zeptojs.cn/) or [jQuery v2+](http://jquery.com/)，可选依赖[mock.js](http://mockjs.com/)



```
// Aimee-app由4个基本文件组成
nav
├── nav.jade 			// app的jade模板，构建过程中会被编译成amd模块进行调用
├── nav.js 				// app功能js文件
├── nav.json.js 		// app模拟数据，基于mock规则，用于测试
├── nav.less 			// app的样式文件
└── img 				// app的图片文件夹
```

```
// 基本使用，定义一个 aimee-app
var app, App;

App = require('app');
app = App.define({
	name: 'nav',
	version: '1.0.0',
	template: require('./nav.jade')
});

module.exports = app;
```


```
// 高级使用，定义一个 aimee-app
var app, App;

App = require('app');
app = App.define({
	name: 'nav',
	version: '1.0.0',
	template: require('./nav.jade'),

	// app渲染到页面之前执行，用于预处理渲染内容
	preprocess: function(content){
		var tmp = $(document.createElement('div'));
		tmp.html(content);
		tmp.find('li').eq(0).addClass('selected');
		// 必须将处理后的内容返回给框架，便于下个插件继续处理
		return tmp.html();
	},

	// app渲染到页面之后执行
	postprocess: function(element){
		// element是app的父级dom的Zepto对象
	},

	// app通用事件绑定在这里
	bind: function(element){
		// element是app的父级dom的Zepto对象
	}
});

// app渲染之前触发，类似于preprocess方法
app.fn.on('before', function(data){
	return data
});

// app渲染之后触发，类似于postprocess方法
app.fn.on('after', function(element){
	// your code 
});

module.exports = app;
```

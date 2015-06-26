var app, APP, appclass, types, guid = require('guid');

app = {
	name: 'app',
	version: '1.0.0',
	author: 'gavinning',
	homepage: 'https://github.com/gavinning/aimee-app'
};

// 事件类型
types = 'blur focus focusin focusout load resize scroll unload click dblclick ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select submit keydown keypress keyup error contextmenu'.split( );

appclass = {
	extend: function(){
		$.extend.apply(null, [this].concat([].slice.call(arguments, 0)))
	},

	element: function(){
		return $('#' + this.ui.id);
	},

	// 设置组件皮肤
	skin: function(className){
		this.ui.className = className;
		return this;
	},

	attr: function(key, value){
		if(!value){
			return this.ui[key];
		}
		else{
			this.ui ? '' : this.ui = {};
			this.ui[key] = value;
			return this;
		}
	},

	// 返回renderId
	renderId: function(){
		return this.renderString + this.name;
	},

	// 渲染到页面
	render: function(id, data){
		if(!id){
			id = '#' + this.renderId();
		}

		if($.isPlainObject(id)){
			data = id;
			id = '#' + this.renderId();
		}

		$(id || '#' + this.renderId()).replaceWith(this.html(data));

		this.bind($('#' + this.attr('id')));
		this.__renderAfter();
	},

	// 插入到指定id之后
	append: function(id, data){
		$(id).append(this.html(data));
		this.bind();
		return this;
	},

	// 插入到指定id之前
	prepend: function(id, data){
		$(id).prepend(this.html(data));
		this.bind();
		return this;
	},

	// 返回html
	html: function(data){
		return this.__renderBefore(this.template(this.data(data)));
	},

	mock: function(){
		var mock = require('mock').mock;
		var data = require(this.name + '/' + this.name + '.json');
		return mock(data);
	},

	// 返回组合数据
	data: function(data){
		if(config.env === 'online'){
			return $.extend({UI: this.ui}, data || {});
		};

		if(config.env === 'mock' || config.env === 'mockjs'){
			return $.extend({UI: this.ui}, this.mock(), data || {})
		};
	},

	// 对返回的合成数据进行预处理
	preprocess: function(data){
		return data;
	},

	// app渲染之后 
	postprocess: function(widget){

	},

	// 组件事件绑定
	bind: function(element){
		return this;
	},

	// 组件注册
	reg: function(id, data){
		this.render(id, data);
		return this;
	},

	find: function(selector){
		return this.element().find(selector)
	},

	delegate: function(el, type, fn){
		this.element().delegate(el, type, fn);
		return this;
	},

	// 监听事件
	on: function(id, fn){
		if(types.indexOf(id) >= 0){
			this.element().on(id, fn);
			return this;

		} else {
			this.__EventMap ? '' : this.__EventMap = {};
			this.__EventMap[id] ? '' : this.__EventMap[id] = [];
			this.__EventMap[id].push(fn);
			return this;
		}
	},

	// 取消监听
	off: function(id){
		this.__EventMap[id] = [];
		return this;
	},

	// 组件渲染之前 预处理
	__renderBefore: function(data){
		data = this.preprocess(data);
		!this.__EventMap || !this.__EventMap.before || this.__EventMap.before.forEach(function(fn){
			data = fn(data)
		});
		return data;
	},

	// 组件渲染之后 后处理
	__renderAfter: function(){
		var widget = $('#' + this.attr('id'));
		this.postprocess(widget);
		!this.__EventMap || !this.__EventMap.after || this.__EventMap.after.forEach(function(fn){
			fn(widget)
		});
	}
};


// 父类
APP = function(obj){
	// 子类
	function App(){
		$.extend(this, obj);
		this.renderString = obj.renderString || 'lincoapp-id-';
		this.guid = guid();
		this.ui = {};
		this.ui.id = 'lincoapp-' + this.guid;
		this.ui.className = '';
	};
	App.aimee = {
		app: true,
		widget: true
	};
	App.fn = App.prototype = appclass;
	return App;
};

app.define = function(obj){
	return new APP(obj);
};

module.exports = app;

/**
 * App for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/app
 */

var app, App, aimee, config, Class, types, EventMaps;

aimee = require('aimee');
config = aimee.getConfig();
Class = aimee.Class;

App = Class.create();
App.version = '1.0.0';

// 事件类型
types = ['before', 'after', 'data'];
// EventMaps
EventMaps = ('blur focus focusin focusout load resize scroll unload click dblclick ' +
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
    'webkitAnimationEnd webkitTransitionEnd animationEnd transitionEnd ' +
    'change select submit keydown keypress keyup error contextmenu').split(' ');

App.fn.extend({
    renderString: 'lincoapp-id-',
    guid: aimee.guid(),
    aimee: {
        app: true
    }
});

App.extend({

   // 返回组合数据
    data: function(data){
        // 无数据默认返回MockData
        if(!data){
            return app.getMockData();
        }

        // 非Map类型直接返回
        if(!$.isPlainObject(data)){
            return data;
        }

        // data && $.isPlainObject(data) &
        if(config.env === 'mock' || config.env === 'mockjs'){
            return $.extend(app.getMockData(), data)
        }

        return data;
    },

    // 返回renderId
    renderId: function(){
        return app.renderString + app.name;
    },

    // 执行模块渲染
    render: function(id, type){
        if(!id || $.isPlainObject(id)){
            id = '#' + App.renderId();
        };

        // 渲染前预处理
        this.prerender(this);

        if(!type){
            // 执行渲染
            app.getPage() ?
                app.getPage().find(id).eq(0).replaceWith(app.getApp()): // this.getApp() || this.html(data)
                $(id).replaceWith(app.getApp());
        }

        // 后置插入到指定id
        if(type === 'appendTo'){
            $(id).append(app.getApp());
        }

        // 前置插入到指定id
        if(type === 'prependTo'){
            $(id).prepend(app.getApp());
        }

        // 渲染后处理
        this.postrender(this);
    },

    // 组件渲染预处理，内部使用
    __prerender: function(){
        // 预处理需要添加到thisApp上的属性
        app.__attr ? app.getApp().attr(app.__attr) : '';
    },

    // 组件渲染后处理，内部使用
    __postrender: function(){

    },

    // 组件渲染之预处理
    prerender: function(){
        this.__prerender(app);
        app.include(app);
        app.prerender(app);
        !app.__EventMap ||
        !app.__EventMap.before ||
        app.__EventMap.before.forEach(function(fn){
            fn(app)
        });
    },

    // 组件渲染之后处理
    postrender: function(){
        this.__postrender(app);
        app.bind(app);
        app.postrender(app);
        !app.__EventMap ||
        !app.__EventMap.after ||
        app.__EventMap.after.forEach(function(fn){
            fn(app)
        });
    },

    // 合并指定Zepto对象的 id、class
    merge: function(target, source){
        target.attr('id', source.attr('id'));
        target.addClass(source.attr('class'));
    }
});

App.fn.extend({
    init: function(data, noMock){
        // 缓存App实例
        app = this;
        // 初始化App数据
        this._data = noMock ? (data || {}) : App.data(data);
        this._data.config = this._config = {};
        this._noMock = noMock;
        // 构建临时Zepto对象，App编译前skin、addClass等操作将作用于此
        this.__app = $(document.createElement('div'));
        return this;
    },

    // 编译数据并缓存App Zepto对象
    compile: function(){
        // Compile
        this._app = $(this.template(this.getData()));
        // Merge id, className
        App.merge(this._app, this.__app);
        // Clear tmp Zepto
        this.__app = null;
        return this;
    },

    // 获取来自页面的数据
    getData: function(){
        return this._data;
    },

    // 获取mock模拟数据
    getMockData: function(){
        var data;
        var mock = require('mock').mock;

        try{
            data = require(this.name + '/' + this.name + '.json');
        }catch(e){
            data = {};
        }

        return mock(data);
    },

    // 返回模块jQuery对象
    getApp: function(){
        return this._app || this.__app;
    },

    // 返回所属页面jQuery对象
    getPage: function(){
        return this.page ? this.page._page : false;
    },

    // 设置模块皮肤
    skin: function(className){
        if(className)
            className.split(' ').forEach(function(item){
                app.addClass('skin-' + item)
            })
            return this;
    },

    addClass: function(className){
        this.getApp().addClass(className);
        return this;
    },

    removeClass: function(className){
        this.getApp().removeClass(className);
        return this;
    },

    render: function(id){
        this.compile();
        App.render(id);
        return this;
    },

    append: function(obj){
        this.getApp().append(obj);
        return this;
    },

    prepend: function(obj){
        this.getApp().prepend(obj);
        return this;
    },

    appendTo: function(id){
        App.render(id, 'appendTo');
        return this;
    },

    prependTo: function(id){
        App.render(id, 'prependTo');
        return this;
    },

    find: function(selector){
        return this.getApp().find(selector);
    },

    // 标准扩展处理
    include: function(app){
        return this;
    },

    // 标准预处理
    prerender: function(app){
        return this;
    },

    // 标准后处理
    postrender: function(app){
        return this;
    },

    // 页面渲染后，被覆盖
    pagerender: function(){

    },

    // 标准事件绑定处理
    bind: function(app){
        return this;
    },

    delegate: function(el, type, fn){
        this.getApp().delegate(el, type, fn);
        return this;
    },

    // 传入配置文件
    config: function(config){
        if(config){
            this._config = this.extend({}, this._config, config);
            this._data.config = this._config;
        return this;
        }
        else{
            this._config ? '' : this._config = {};
            return this._config;
        }
    },

    // 监听事件
    on: function(id, fn){
        // 转发给底层框架处理
        // if(types.indexOf(id) < 0){
        if(EventMaps.indexOf(id) >= 0){
            this.getApp().on(id, fn);
            return this;

        // 自处理types内的事件类型
        } else {
            this.__EventMap ? '' : this.__EventMap = {};
            this.__EventMap[id] ? '' : this.__EventMap[id] = [];
            this.__EventMap[id].push(fn);
            return this;
        }
    },

    fire: function(id){
        var args = [].slice.call(arguments, 1);
        this.__EventMap ? '' : this.__EventMap = {};
        this.__EventMap[id] ? '' : this.__EventMap[id] = [];
        this.__EventMap[id].forEach(function(fn){
            fn.apply(app, args)
        })
        return this;
    },

    // 取消监听
    off: function(id){
        // 转发给底层框架处理
        if(types.indexOf(id) < 0){
            this.getApp().off(id);
            return this;

        // 自处理types内的事件类型
        } else {
            this.__EventMap[id] = [];
            return this;
        }
    },

    export: function(App, fn){
        var thisPage;
        var app = new App;
        this.app ? '' : this.app = {};

        // 用于简单调用模块，仅用于开发测试环境
        if(typeof fn === 'object'){
            thisPage = fn;
            fn = null;
        };

        // 检查重复加载
        if(this.app[app.guid]){
            return console.error(app.guid + ' is exist');
        };

        // 缓存app对象到页面
        this.app[app.name] ? '' : this.app[app.name] = [];
        this.app[app.name].push(app);
        // 定义get方法用于获取app实例
        this.app[app.name].get = function(index, fn){
            if(typeof index === 'function'){
                fn = index;
                index = 0;
            }

            if(typeof fn === 'function'){
                fn.call(this[index], this[index])
            }
            else{
                return this[typeof index === 'number' ? index : 0];
            }
        };

        // 存储需要添加的属性
        // 标记当前app在同类app数组中的位置
        app.__attr ? '' : app.__attr = {};
        app.__attr['data-code'] = this.app[app.name].length - 1;

        // 缓存引用页面对象
        app.page = this.page;

        // 缓存父级模块
        app.parent = this;

        // 缓存pm对象
        app.pm = this.pm;

        // 没有回调时自动渲染，仅用于开发测试环境
        fn ? fn.call(app, app) : app.init().render();

        if(!fn){
            return app;
        }
    },

    exports: function(id, fn){
        // id === string
        if(typeof id === 'string'){
            // 多个组件调用，返回page对象
            if(id.split(' ').length > 1){
                this.exports(id.split(' '), fn);
                return this;
            }
            // 单个组件调用返回app对象
            else{
                return this.export(require(id), fn);
            }
        }
    }

});

module.exports = App;

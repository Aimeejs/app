/**
 * Aimee-app
 * Author by gavinning
 * Homepage https://github.com/gavinning/aimee-app
 */

var app, App, aimee, config, Class, types;

aimee = require('aimee');
config = aimee.getConfig();
Class = aimee.Class;

App = Class.create();
App.version = '1.0.0';
App.aimee = {
    app: true,
    widget: true
};

// 事件类型
types = ['before', 'after'];

App.fn.extend({
    renderString: 'lincoapp-id-',
    guid: aimee.guid()
});

App.extend({
    // mock: function(){
    //     var mock = require('mock').mock;
    //     var data = require(app.name + '/' + app.name + '.json');
    //     return mock(data);
    // },

    // 返回组合数据
    data: function(data){
        return config.env === 'mock' || config.env === 'mockjs' ?
            $.extend(app.getMockData(), data || {}) : data;
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
        this.prerender(app.getApp());

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
        this.postrender(app.getApp());
    },

    // 组件渲染预处理，内部使用
    __prerender: function(){
        // 预处理需要添加到thisApp上的属性
        app.__attr ? app.attr(app.__attr) : '';
    },

    // 组件渲染后处理，内部使用
    __postrender: function(){

    },

    // 组件渲染之预处理
    prerender: function(thisApp){
        this.__prerender(thisApp);
        app.prerender(thisApp);
        !app.__EventMap || !app.__EventMap.before || app.__EventMap.before.forEach(function(fn){
            fn(thisApp)
        });
    },

    // 组件渲染之后处理
    postrender: function(thisApp){
        this.__postrender(thisApp);
        app.postrender(thisApp);
        !app.__EventMap || !app.__EventMap.after || app.__EventMap.after.forEach(function(fn){
            fn(thisApp)
        });
    }
});

App.fn.extend({
    init: function(data){
        this.compile(data);
        return this;
    },

    // 执行数据模板编译
    compile: function(data){
        app = this;
        // 缓存数据
        this._data = App.data(data);
        // 缓存app.jquery对象
        this._app = $(this.template(this.getData()));
        return this;
    },

    // 获取来自页面的数据
    getData: function(){
        return this._data;
    },

    // 获取mock模拟数据
    getMockData: function(){
        var mock = require('mock').mock;
        var data = require(this.name + '/' + this.name + '.json');
        return mock(data);
    },

    // 返回模块jQuery对象
    getApp: function(){
        return this._app;
    },

    // 缓存所属页面jQuery对象
    setPage: function(page){
        this._page = page;
        return this;
    },

    // 返回所属页面jQuery对象
    getPage: function(){
        return this._page;
    },

    // 设置模块皮肤
    skin: function(className){
        this.addClass('skin-' + className);
        return this;
    },

    // 设置模块属性
    attr: function(key, value){
        if(!value){
            return this.getApp().attr(key);
        }
        else{
            this.getApp().attr(key, value);
            return this;
        }
    },

    setId: function(id){
        this.getApp().attr('id', id);
        return this;
    },

    getId: function(){
        return this.getApp().attr('id');
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

    // 对返回的合成数据进行预处理
    prerender: function(thisApp){
        return this;
    },

    // app渲染之后
    postrender: function(thisApp){
        return this;
    },

    // 类的事件，可选，调用方式：app.bind();
    bind: function(){
        return this;
    },

    delegate: function(el, type, fn){
        this.getApp().delegate(el, type, fn);
        return this;
    },

    // 监听事件
    on: function(id, fn){
        // 转发给底层框架处理
        if(types.indexOf(id) < 0){
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
    }
});

module.exports = App;

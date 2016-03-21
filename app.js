/**
 * App for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/app
 */

var App, app, private, guid, aimee, Class, zeptoArray;

guid = require('guid');
aimee = require('aimee');
Class = require('class');
App = module.exports = Class.create();

// Method Extend From Zepto
zeptoArray = ('show hide on off delegate undelegate addClass removeClass ' +
             'append prepend').split(' ');
zeptoArray.forEach(function(name){
    App.fn[name] = function(){
        $.fn[name].apply(this.getApp(), arguments)
        return this;
    }
})

// 非开放de私有方法
private = {

    // 返回支持Mock的数据
    getData: function(app, data){
        return data && !$.isPlainObject(data) ?
            app.getMockData() : $.extend(app.getMockData(), data);
    },

    // 获取app的renderId
    getRenderId: function(app){
        return app.renderString + app.name;
    },

    // 支持app.render
    render: function(app, id, type){
        id = id || '#' + this.getRenderId(app);

        this.prerender(app);

        // 执行渲染
        app.getPage() ?
            app.getPage().find(id).eq(0).replaceWith(app.getApp()):
            $(id).replaceWith(app.getApp());

        this.postrender(app)
    },

    // 支持app预处理
    prerender: function(app){
        app.include(app);
        app.prerender(app);
        // 预处理需要添加到thisApp上的属性
        app.__attr ? app.getApp().attr(app.__attr) : '';
    },

    // 支持app后处理
    postrender: function(app){
        app.bind(app);
        app.postrender(app);
    },

    // 合并指定Zepto对象的 id、class
    merge: function(target, source){
        if(!source){
            return
        }
        target.attr('id', source.attr('id'));
        target.addClass(source.attr('class'));
    }
}

// Base
App.include({
    guid: guid(),
    renderString: 'lincoapp-id-',
    aimee: {app: true}
})

// Core
App.include({

    init: function(data){
        // 初始化App数据
        !$.isEmptyObject(data) ?
            this._data = data :
            this._data = this.getMockData();

        // 检查默认数据是存在config
        this._data.config ?
            // 存在则直接赋值
            this._config = this._data.config:
            // 不存在则初始化
            this._data.config = this._config = {};

        // 构建临时Zepto对象，App编译前skin、addClass等操作将作用于此
        this.__app = aimee.$('div');
        return this;
    },

    // 编译数据并缓存App Zepto对象
    compile: function(data){
        // Compile
        this._app = $(this.template(data || this.getData()));
        // Merge id, className
        private.merge(this._app, this.__app);
        // Clear tmp Zepto
        this.__app = null;
        return this;
    },

    // 获取mock模拟数据
    getMockData: function(){
        var data;
        var mock = require('mock').mock;

        try{
            data = require(this.name + '/' + this.name + '.json');
        }
        catch(e){
            // 虚拟组件可自由定制数据
            data = this._data || {};
        }

        return mock(data);
    },

    // 获取来自页面的数据
    getData: function(){
        return this._data || this.getMockData();
    },

    setData: function(data){
        this._data = data;
        return this;
    },

    // 返回模块jQuery对象
    getApp: function(){
        return this._app || this.__app;
    },

    setApp: function($dom){
        this._app = $dom;
        return this;
    },

    // 返回所属页面jQuery对象
    getPage: function(){
        return this.page ? this.page._page : false;
    },

    render: function(id){
        this.compile();
        private.render(this, id);
        return this;
    },

    // 重载
    reload: function(inherit, data){
        if($.isPlainObject(inherit)){
            data = inherit;
            inherit = false;
        }

        !inherit ?
            data :
            data = $.extend(true, {}, this.getData(), data);

        this.compile(data)

        return this;
    },

    // 传入配置文件
    config: function(key, value){
        var _config = {};

        if(value && typeof key === 'string'){
            _config[key] = value;
            this.extend(this._config, _config);
            return this;
        }

        if(!value && $.isPlainObject(key)){
            this._config = this.extend({}, this._config, key);
            this._data.config = this._config;
        return this;
        }

        if(!key){
            this._config ? '' : this._config = {};
            return this._config;
        }
    }
})

// Rewrite
App.include({

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
    }
})

// Supplementary
App.include({
    // 设置模块皮肤
    skin: function(className){
        var it = this;

        if(className)
            className.split(' ').forEach(function(item){
                it.addClass('skin-' + item)
            })
        return this;
    },

    // 删除模块皮肤
    removeSkin: function(className){
        var it = this;

        if(className)
            className.split(' ').forEach(function(item){
                it.removeClass('skin-' + item)
            })
            return this;
    },

    find: function(selector){
        return this.getApp().find(selector);
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

/**
 * App for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/app
 */

let zeptoArray;

import guid from 'guid';
import Base from 'class';
import Config from 'config';

// 非开放de私有方法
class Privates {
    // 返回支持Mock的数据
    getData(app, data) {
        return data && !$.isPlainObject(data) ?
            app.getMockData() : $.extend(app.getMockData(), data);
    }

    // 获取app的renderId
    getRenderId(app) {
        return app.renderString + app.name;
    }

    // 支持app.render
    render(app, id, type) {
        id = id || '#' + this.getRenderId(app);

        this.prerender(app);

        // 执行渲染
        app.getPage() ?
            app.getPage().find(id).eq(0).replaceWith(app.getApp()):
            $(id).replaceWith(app.getApp());

        this.postrender(app)
    }

    // 支持app预处理
    prerender(app) {
        app.prerender(app);
        // 预处理需要添加到thisApp上的属性
        app.__attr ? app.getApp().attr(app.__attr) : '';
    }

    // 支持app后处理
    postrender(app) {
        app.postrender(app);
    }

    // 合并指定Zepto对象的 id、class
    merge(target, source) {
        if(!source){
            return
        }
        target.attr('id', source.attr('id'));
        target.addClass(source.attr('class'));
    }
}

let privates = new Privates;

class App extends Base {

    constructor() {
        super();
        this.guid = guid();
        this.aimee = { app: true };
        this.renderString = 'lincoapp-id-';
        this.CONFIG = new Config;
        this.CONFIG.init({});
    }

    init(data) {
        // 初始化App数据
        !$.isEmptyObject(data) ?
            this._data = data :
            this._data = this.getMockData();

        // 检查默认数据是存在config
        this._data.config ?
            // 存在则直接赋值
            this.CONFIG.init(this._data.config):
            // 不存在则初始化
            this._data.config = this.CONFIG.get();

        // 构建临时Zepto对象，App编译前skin、addClass等操作将作用于此
        this.__app = aimee.$('div');
        return this;
    }

    // 编译数据并缓存App Zepto对象
    compile(data) {
        this._prevApp = this._app;
        // Compile
        this._app = $(this.template(data || this.getData()));
        // Merge id, className
        privates.merge(this._app, this.__app);
        // Clear tmp Zepto
        this.__app = null;
        return this;
    }

    /**
     * 批量绑定事件
     * @param   {Object}  events 事件对象模型
     * @example
     * this.bind({
     * 		'click@.lincoapp-footer': () => {
     * 			// do something
     * 		}
     * 		'click, focus@.lincoapp-comment': () => {
     * 			// do something
     * 		}
     * })
     */
    bind(events) {
        events = events || {};
        $.each(events, (key, fn) => {
            let pair = key.split('@');
            let evts = pair[0].split(/,\s*/g);
            evts.forEach((type) => {
                this.on(type, pair[1], fn)
            })
        })
    }

    render(id, data) {
        this.onload();
        this.compile(data);
        privates.render(this, id);
        return this;
    }

    // 重载
    reload(inherit, data) {
        if($.isPlainObject(inherit)){
            data = inherit;
            inherit = false;
        }

        !inherit ?
            data :
            data = $.extend(true, {}, this.getData(), data);

        this.render(this._prevApp, data);
        return this;
    }

    // 传入配置文件
    config() {
        return this.CONFIG.general.apply(this.CONFIG, arguments) || this;
    }

    // 获取mock模拟数据
    getMockData() {
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
    }

    // 获取来自页面的数据
    getData() {
        return this._data || this.getMockData();
    }

    setData(data) {
        this._data = data;
        return this;
    }

    // 返回模块jQuery对象
    getApp() {
        return this._app || this.__app;
    }

    setApp($dom) {
        this._app = $dom;
        return this;
    }

    setPage(page) {
        this.page = page;
        return this;
    }

    // 返回所属页面jQuery对象
    getPage() {
        return this.page ? this.page._page : false;
    }

    // 设置模块皮肤
    skin(className) {
        var it = this;

        if(className)
            className.split(' ').forEach(function(item){
                it.addClass('skin-' + item)
            })
        return this;
    }

    // 删除模块皮肤
    removeSkin(className) {
        var it = this;

        if(className)
            className.split(' ').forEach(function(item){
                it.removeClass('skin-' + item)
            })
            return this;
    }

    find(selector) {
        return this.getApp().find(selector);
    }

    export(App, fn) {
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
    }

    exports(id, fn) {
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

    // Rewrite

    // 初始化后
    onload() {
        return this
    }

    // 渲染预处理
    prerender(app) {
        return this
    }

    // 渲染后处理
    postrender(app) {
        return this
    }

    // 页面渲染后，被覆盖
    pagerender(app) {
        return this
    }
}

App.aimee = { app: true }

// Method Extend From Zepto
zeptoArray = ('show hide on off delegate undelegate addClass removeClass ' +
             'before after append prepend appendTo prependTo').split(' ')
zeptoArray.forEach(function(name){
    App.prototype[name] = function() {
        $.fn[name].apply(this.getApp(), arguments)
        return this;
    }
})

export default App;

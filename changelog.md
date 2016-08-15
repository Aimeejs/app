v2.1.4
---
* Fixbug 修正``config``方法对空值判断失误的问题，修正空值判断为``empty === undefined``

v2.1.3
---
* 新增``this.getParent``方法，返回其调用者
* 优化``Privates.prototype.render``方法，父级查询方式更改为``this.getParent``
* Fixbug 优化``this.export``方法，修正不能正确渲染数据的问题

v2.1.2
---
* 优化``init``方法，删除``this._config``对象，配置项交由``config.app``进行管理
* 优化``render``方法，接受第二个参数作为``data``
* 优化``compile``方法，为配合``reload``方法，编译前缓存上次渲染的对象
* Fixbug 修正``reload``不能正确渲染到浏览器的问题

v2.1.1
---
* 删除app自身对``app.bind的``调用

v2.1.0
---
* 新增框架级事件绑定方法``bind``用于批量绑定事件
* 新增流程控制方法``onload``用于对数据进行包装，``onload``将在init之后自动执行，无需开发者调用

v2.0.2
---
Fixbug 修正``app.config``方法

v2.0.1
---
补齐``App.aimee``标记

v2.0.0
---
* => ES6
* 恢复``setPage``方法，用于直接调用app时快捷设置渲染页面
* 继承底层框架``(Zepto|jQuery)``部分方法
``show hide on off delegate undelegate addClass removeClass append prepend appendTo prependTo``
* 修改保留关键字``private => privates``
* 重写``config``方法

v1.0.8 - v1.0.9
---
Update readme.md

v1.0.7
---
fix bug, 解决app.exports方法内app调用的bug

v1.0.6
---
fix bug, ```app.init```中初始化app._config, app._data.config，解决模板中调用config.method报错的问题

v1.0.5
---
* 优化App编译时机，由```app.init```时编译更改为```app.render```时编译，在```app.render```之前对data的更新都将有效反应到模板中，从此```app.config```可对app模板产生影响，如果只需要编译而不需要render可以直接执行```app.init().compile()```即可
```javascript
// In app.js
app.init(data).config({foo: "bar"}).render()
```
```jade
// In app.jade
if(config.foo)
    .title #{config.foo}
```
* 废弃```app.attr```
* 废弃```app.setId```
* 废弃```app.getId```
* 废弃```app.setPage```
* 优化```app.compile``` 同步编译前对app的skin、addClass等操作
* 优化```app.config``` 配置信息将写入data.config
* 优化```app.getApp``` 编译前将返回临时app Zepto对象
* 优化```app.render``` 渲染前执行模板编译
* 优化```app.init``` 不再做模板编译操作，用于构建数据，和临时Zepto对象等

v1.0.4
---
fix bug: 解决全局模块不能正常渲染的问题

优化app.getPage方法，处理app.page不存在的情况
v1.0.3
---
优化app.getPage方法，处理app.page不存在的情况

v1.0.2
---
App原型链新增App.fn.aimee.app属性，默认为true，用于检查是否为App实例

v1.0.1
---
优化app.getMockData方法

v1.0.0
---
create app

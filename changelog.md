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
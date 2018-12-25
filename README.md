# wsclient

`wsclient`是一个建立ws连接的模块;


### 安装
```
npm install wsclient
```

### 使用

```js
var wsclient = require('wsclient');
var events = {}
const wsObj = new wsclient(events)
wsObj.startSocket('ws://localhost/ws')


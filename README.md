# promise 实现

这个是一个利用 setTimeout 的宏任务的方式实现的 promise 库, 已通过官方的 promises-aplus-tests 的单元测试. 和浏览器原生的 Promise 有差别, 供学习理解.

# promise-demo

This is promise demo that passed promise-aplus-test test case;

# 安装

```
npm install
```

或者

```
yarn install
```

# 运行

如果全局安装了`promises-aplus-tests`

命令行

```
promises-aplus-tests ./promise.js
```

否者

```
node ./promise-adaptor.js
```

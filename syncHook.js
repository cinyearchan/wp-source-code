const { SyncHook } = require('tapable')

let hook = new SyncHook(['name', 'age'])

// 添加事件监听
hook.tap('fn1', function (name, age) {
  console.log('fn1 ---> ', name, age)
})

hook.tap('fn2', function (name, age) {
  console.log('fn2 ---> ', name, age)
})

// 触发事件监听
hook.call('webpack', 8)

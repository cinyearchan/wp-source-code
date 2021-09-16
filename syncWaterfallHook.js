const { SyncWaterfallHook } = require('tapable')

let hook = new SyncWaterfallHook(['name', 'age'])

hook.tap('fn1', function (name, age) {
  console.log('fn1 ---> ', name, age)
  return 'fn1'
})

hook.tap('fn2', function (name, age) {
  console.log('fn2 ---> ', name, age)
  return 'fn2'
})

hook.tap('fn3', function (name, age) {
  console.log('fn3 ---> ', name, age)
  return 'fn3'
})

hook.call('webpack', 8)

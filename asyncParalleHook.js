const { AsyncParallelHook } = require('tapable')

let hook = new AsyncParallelHook(['name'])

console.time('time')

// 异步钩子有三种添加事件监听的方式
// tap
// hook.tap('fn1', function (name) {
//   console.log('fn1 ---> ', name)
// })

// hook.tap('fn11', function (name) {
//   console.log('fn11 ---> ', name)
// })

// tapAsync
// hook.tapAsync('fn2', function (name, callback) {
//   setTimeout(() => {
//     console.log('fn2 ---> ', name)
//     callback()
//   }, 1000)
// })

// hook.tapAsync('fn22', function (name, callback) {
//   setTimeout(() => {
//     console.log('fn22 ---> ', name)
//     callback()
//   }, 2000)
// })

// hook.callAsync('webpack', function () {
//   console.log('最后执行回调')
//   console.timeEnd('time')
// })

// tapPromise
hook.tapPromise('fn3', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fn3 ---> ', name)
      resolve()
    }, 1000)
  })
})

hook.tapPromise('fn33', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fn33 ---> ', name)
      resolve()
    }, 2000)
  })
})

hook.promise('webpack').then(() => {
  console.log('timeEnd')
  console.timeEnd('time')
})

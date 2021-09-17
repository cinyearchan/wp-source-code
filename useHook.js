// const { AsyncParallelHook } = require('tapable')
const AsyncParallelHook = require('./asyncParallelHook.js')

let hook = new AsyncParallelHook(['name', 'age'])

hook.tapAsync('fn1', function (name, age, callback) {
  console.log('fn1 ---> ', name, age)
  callback()
})

hook.tapAsync('fn2', function (name, age, callback) {
  console.log('fn2 ---> ', name, age)
  callback()
})

hook.tapAsync('fn3', function (name, age, callback) {
  console.log('fn3 ---> ', name, age)
  callback()
})

hook.callAsync('webpack', 8, function () {
  console.log('end')
})

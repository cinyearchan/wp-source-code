class Hook {
  constructor (args = []) {
    this.args = args
    this.taps = [] // 用于存放组装好的 {} 对象信息 type fn options
    this._x = undefined // 经过 codeFactory 处理后 _x = [f1, f2, f3, ...]
  }

  tap (options, fn) {
    if (typeof options === 'string') {
      options = { name: options }
    }
    options = Object.assign({ fn }, options) // { fn: fn, name: 'fn1' }
    
    // 调用以下方法将组装好的 options 添加至 []
    this._insert(options)
  }

  tapAsync (options, fn) {
    if (typeof options === 'string') {
      options = { name: options }
    }
    options = Object.assign({ fn }, options) // { fn: fn, name: 'fn1' }
    
    // 调用以下方法将组装好的 options 添加至 []
    this._insert(options)
  }

  _insert (options) {
    this.taps[this.taps.length] = options
  }

  call (...args) {
    // 创建将来要具体执行的函数代码结构——手动构造要执行的函数
    let callFn = this._createCall()
    // 调用上述的函数（args 传入进去）
    return callFn.apply(this, args)
  }

  callAsync (...args) {
    // 创建将来要具体执行的函数代码结构——手动构造要执行的函数
    let callFn = this._createCall()
    // 调用上述的函数（args 传入进去）
    return callFn.apply(this, args)
  }

  _createCall () {
    return this.compile({ //compile 由具体的子类进行实现，此处只是提供模板，传入必要的参数
      taps: this.taps,
      args: this.args
    })
  }
}

module.exports = Hook

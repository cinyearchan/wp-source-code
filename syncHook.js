let Hook = require('./Hook.js')

class HookCodeFactory {
  args () {
    return this.options.args.join(',') // ['name', 'age'] --> name, age
  }
  head () {
    return `var _x = this._x;`
  }
  content () {
    let code = ``
    for (var i = 0; i < this.options.taps.length; i++) {
      code += `console.log(_x[${i}]);var _fn${i} = _x[${i}];_fn${i}(${this.args()});`
    }
    return code
  }
  // 准备后续需要使用的数据
  setup (instance, options) { // instance 是具体的 hook 实例，options -> { taps: [{}, {}], args: [/*new xxHook 时传入的参数*/name, age] }
    this.options = options // 源码中，此操作通过 init 方法实现，当前是将 options 直接挂载在 this 上
    instance._x = options.taps.map(o => o.fn) // 对具体的 hook 实例而言，this._x = [fn1, fn2, fn3, ...] 
  }
  // 创建一段可执行的代码体并返回
  create (options) {
    let fn
    // 目标 fn = new Function("name, age", "var _x = this._x, var _fn0 = _x[0]; _fn0(name, age);")
    fn = new Function(
      this.args(),
      `${this.head()}${this.content()}`
    )
    return fn
  }
}

class SyncHook extends Hook {
  constructor (args) {
    super(args)
  }

  compile (options) {
    /**
     * CodeFactory 类
     * 有两个方法
     * setup(this, options)
     * return factory.create(options)
     */
    let factory = new HookCodeFactory()
    factory.setup(this, options)
    return factory.create(options)
  }
}

module.exports = SyncHook

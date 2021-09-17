const Hook = require('./Hook.js')

class HookCodeFactory {
  args ({ after, before } = {}) {
    let allArgs = this.options.args
    if (before) {
      allArgs = [before].concat(allArgs)
    }
    if (after) {
      allArgs = allArgs.concat(after)
    }
    return allArgs.join(',')
  }
  head () {
    return `'use strict';var _content;var _x = this._x;`
  }
  content () {
    let code = `var _counter = ${this.options.taps.length};var _done = (function () { _callback(); });`
    for (var i = 0; i < this.options.taps.length; i++) {
      code += `var _fn${i} = _x[${i}];_fn${i}(${this.args()}, (function () { if (--_counter === 0) _done(); }));`
    }
    return code
  }
  setup (instance, options) {
    this.options = options
    instance._x = options.taps.map(o => o.fn)
  }
  create (options) {
    let fn
    fn = new Function(
      this.args({ after: '_callback' }),
      `${this.head()}${this.content()}`
    )
    return fn
  }
}

class AsyncParallelHook extends Hook {
  constructor (args) {
    super(args)
  }

  compile (options) {
    let factory = new HookCodeFactory()
    factory.setup(this, options)
    return factory.create(options)
  }
}

module.exports = AsyncParallelHook

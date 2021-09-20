const { Tapable, AsyncSeriesHook, SyncHook, SyncBailHook, AsyncParallelHook } = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation')
const Stats = require('./Stats')

class Compiler extends Tapable {
  constructor (context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),
      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncBailHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation']),
    }
  }

  newCompilationParams () {
    const params = {
      normalModuleFactory: new NormalModuleFactory()
    }
    return params
  }

  newCompilation (params) {
    const compilation = this.createCompilation()
    this.hooks.thisCompilation.call(compilation, params)
    this.hooks.compilation.call(compilation, params)
    return compilation
  }

  createCompilation () {
    return new Compilation(this)
  }

  compile (callback) {
    const params = this.newCompilationParams()

    this.hooks.beforeRun.callAsync(params, (err) => {
      this.hooks.compile.call(params)

      const compilation = this.newCompilation(params)

      this.hooks.make.callAsync(compilation, (err) => {
        console.log('make 钩子触发')

        callback(err, compilation) // onCompiled 执行
      })
    })
  }

  run (callback) {
    console.log('run 方法执行')

    const finalCallback = function (err, stats) {
      callback(err, stats)
    }

    const onCompiled = function (err, compilation) {
      console.log('onCompiled')
      // finalCallback(err, {
      //   toJson() {
      //     return {
      //       entries: [], // 当前次打包的入口信息
      //       chunks: [], // 当前次打包的 chunk 信息
      //       modules: [], // 模块信息
      //       assets: [], // 当前次打包最终生成的资源
      //     }
      //   }
      // })
      finalCallback(err, new Stats(compilation))
    }

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled)
      })
    })
  }
}

module.exports = Compiler

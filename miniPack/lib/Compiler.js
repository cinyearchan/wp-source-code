const { Tapable, AsyncSeriesHook, SyncHook, SyncBailHook, AsyncParallelHook } = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation')
const Stats = require('./Stats')
const path = require('path')
const mkdirp = require('mkdirp')

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
      emit: new AsyncSeriesHook(['compilation'])
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
        // console.log('make 钩子触发')
        // callback(err, compilation) // onCompiled 执行
        // 开始处理 chunk
        compilation.seal((err) => {
          this.hooks.afterCompile.callAsync(compilation, (err) => {
            callback(err, compilation) // onCompiled 执行
          })
        })
      })
    })
  }

  run (callback) {
    console.log('run 方法执行')

    const finalCallback = (err, stats) => {
      callback(err, stats)
    }

    const onCompiled = (err, compilation) => {
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
      // finalCallback(err, new Stats(compilation))

      // 最终将处理好的 chunk 写入到指定的文件输出至 dist
      this.emitAssets(compilation, (err) => {
        let stats = new Stats(compilation)
        finalCallback(err, stats)
      })
    }

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled)
      })
    })
  }

  /**
   * 创建 dist 目录，在目录创建完成之后执行文件的写操作
   * @param {*} compilation 
   * @param {*} callback 
   */
  emitAssets (compilation, callback) {
    // 工具函数生成执行文件
    const emitFiles = (err) => {
      const assets = compilation.assets
      // 在 minipack.js 中 new Compiler 之后，webpack.config.js 中的配置保存在了 compiler.options 中
      let outputPath = this.options.output.path

      for (let file in assets) {
        // 获取文件内容
        let source = assets[file]
        // 拼接生成目标路径文件名
        let targetPath = path.posix.join(outputPath, file)
        // 将内容写入文件
        this.outputFileSystem.writeFileSync(targetPath, source)
      }

      callback(err)
    }

    // 创建目录后执行文件写入
    this.hooks.emit.callAsync(compilation, (err) => {
      // 创建目录
      mkdirp.sync(this.options.output.path)
      // 执行文件写入
      emitFiles()
    })
  }
}

module.exports = Compiler

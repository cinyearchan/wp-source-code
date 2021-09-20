const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const NormalModuleFactory = require('./NormalModuleFactory')
const Parser = require('./Parser')

// 实例化一个 normalModuleFactory parser
const normalModuleFactory = new NormalModuleFactory()
const parser = new Parser()

class Compilation extends Tapable {
  constructor (compiler) {
    super()
    this.compiler = compiler
    this.context = compiler.context
    this.options = compiler.options
    // 让 compilation 剧本文件读写能力
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    // 存放所有入口模块的数组
    this.entries = []
    // 存放所有模块的数组
    this.modules = []
    this.hooks = {
      succeedModule: new SyncHook(['module'])
    }
  }
  /**
   * 完成模块编译操作
   * @param {*} context 当前项目的根
   * @param {*} entry 当前的入口的相对路径
   * @param {*} name chunkName main
   * @param {*} callback 回调
   */
  addEntry (context, entry, name, callback) {
    this.addModuleChain(context, entry, name, (err, module) => {
      callback(err, module)
    })
  }

  addModuleChain (context, entry, name, callback) {
    // 创建一个模块，作为入口，用于加载其他所有模块
    let entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest: entry,
      resource: path.posix.join(context, entry), // 找到 entry 入口的绝对路径
      parser
    })

    const afterBuild = function (err) {
      callback(err, entryModule)
    }

    this.buildModule(entryModule, afterBuild)

    // 当完成本次 build 操作后，保存 module
    this.entries.push(entryModule)
    this.modules.push(entryModule)
  }

  /**
   * 完成具体的 build 操作
   * @param {*} module 当前需要被编译的模块
   * @param {*} callback 
   */
  buildModule (module, callback) {
    module.build(this, (err) => {
      // 当代码执行到此处，意味着当前 module 的编译完成
      this.hooks.succeedModule.call(module)
      callback(err)
    })
  }
}

module.exports = Compilation

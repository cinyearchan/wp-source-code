const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const async = require('neo-async')
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
    this.createModule({
      name: name,
      context: context,
      rawRequest: entry,
      resource: path.posix.join(context, entry),
      moduleId: './' + path.posix.relative(context, path.posix.join(context, entry)),
      parser
    }, (entryModule) => {
      this.entries.push(entryModule)
    },callback)
  }

  /**
   * 创建空白模块，用于：加载入口模块；加载依赖模块
   * @param {*} data 创建模块时需要的一些属性
   * @param {*} doAddEntry 可选参数，在加载入口模块时，将入口模块的 id 写入 this.entries
   * @param {*} callback 回调
   */
  createModule (data, doAddEntry, callback) {
    /**
     * 封装统一方法用于创建空白模块，该空白模块作为容器用于加载其他模块的内容
     * 区分入口模块和依赖模块，通过 this.entries 和 this.modules 数组进行记录
     * this.entries 记录入口模块
     * this.modules 记录所有模块
     */

    // 创建一个模块，作为入口，用于加载其他所有模块
    // let entryModule = normalModuleFactory.create({
    //   name,
    //   context,
    //   rawRequest: entry,
    //   resource: path.posix.join(context, entry), // 找到 entry 入口的绝对路径
    //   parser
    // })
    // module 改名表示，创建的该空白模块，有可能用来加载入口模块，也可能用来加载被依赖模块
    let module = normalModuleFactory.create(data)

    const afterBuild = (err, module) => {
      // 在 afterBuild 中需要判断：当前次 module 加载完成之后是否需要处理依赖加载
      if (module.dependencies.length > 0) {
        // 当前模块 module 如果有依赖的模块，递归加载该依赖的模块
        this.processDependencies(module, (err) => {
          callback(err, module)
        })
      }
      callback(err, module)
    }

    this.buildModule(module, afterBuild)

    // 当完成本次 build 操作后，保存 module
    // this.entries.push(entryModule)
    doAddEntry && doAddEntry(module)
    // this.modules.push(entryModule)
    this.modules.push(module)
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
      callback(err, module)
    })
  }

  /**
   * 实现一个被依赖模块的递归加载
   * @param {*} module 
   * @param {*} callback 
   */
  processDependencies (module, callback) {
    /**
     * 加载模块的思路都是：创建一个模块，通过这个创建的空白模块加载被依赖的模块的内容
     * 重点：module 依赖的所有模块加载完成后，再执行回调 callback
     * 工具：neo-async
     */

    // 获取当前模块所依赖的模块
    let dependencies = module.dependencies

    async.forEach(dependencies, (dependency, done) => {
      this.createModule({
        name: dependency.name,
        context: dependency.context,
        rawRequest: dependency.rawRequest,
        moduleId: dependency.moduleId,
        resource: dependency.resource,
        parser
      }, null, done)
    }, callback)
  }
}

module.exports = Compilation

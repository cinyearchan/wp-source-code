const path = require('path')
const types = require('@babel/types') // 提供方法用于修改 ast 语法树节点
const generator = require('@babel/generator').default // ast --> code
const traverse = require('@babel/traverse').default // 用于遍历 ast 语法树，使得程序能够进入语法树进行操作

class NormalModule {
  constructor (data) {
    this.context = data.context
    this.name = data.name
    // this.entry = data.entry // 与 rawRequest 即原始请求路径相同，可作删除
    this.rawRequest = data.rawRequest
    // TODO: 等待完成
    this.parser = data.parser
    this.resource = data.resource
    // 存放某个模块的源代码
    this._source
    // 存放某个模块源代码对应的 ast
    this._ast
    // 保存被依赖加载的模块信息
    this.dependencies = []
  }

  build (compilation, callback) {
    // 从文件中读取到将来需要被加载的 module 内容
    // 如果当前不是 js 模块，需要 loader 进行处理，最终返回 js 模块
    // 上述操作完成后，js 代码会被转换为 ast 语法树
    // 当前 js 模块内部可能又引用了其他模块，需要递归完成
    // 前面的完成之后，只需要重复执行即可
    this.doBuild(compilation, (err) => {
      this._ast = this.parser.parse(this._source)
      // _ast 是当前 module 的语法树，对其进行修改，再将 ast 转回成 code 代码
      traverse(this._ast, {
        CallExpression: (nodePath) => {
          let node = nodePath.node

          // 定位 require 关键字所在的节点
          if (node.callee.name === 'require') {
            // 获取原始请求路径
            let modulePath = node.arguments[0].value // './title'
            // 取出当前被加载的模块名称
            let moduleName = modulePath.split(path.posix.sep).pop()  // 统一采用 / 分隔符
            // 当前打包器只处理 js
            let extName = moduleName.indexOf('.') == -1 ? '.js' : ''
            moduleName += extName // title.js

            // 读取当前 js 里的内容
            // 获取 js 的绝对路径
            let depResource = path.posix.join(path.posix.dirname(this.resource), moduleName)

            // 定义当前模块的 id ====>  最终打包到 dist 文件夹里的文件里的 模块定义里，键名 ==> 模块 id
            let depModuleId = './' + path.posix.relative(this.context, depResource) // 做减法 this.context 打包的上下文 与 depResource 当前模块 js 的绝对路径，得到 ./src/title.js

            // console.log(depModuleId)

            // 记录当前被依赖模块的信息，用于递归加载
            this.dependencies.push({
              name: this.name, // TODO 将来需要动态修改
              context: this.context,
              rawRequest: moduleName,
              moduleId: depModuleId,
              resource: depResource
            })
          }
        }
      })

      callback(err)
    })
  }

  doBuild (compilation, callback) {
    this.getSource(compilation, (err, source) => {
      // source 是读取到的文件内容
      this._source = source
      callback()
    })
  }

  getSource (compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf8', callback)
  }
}

module.exports = NormalModule

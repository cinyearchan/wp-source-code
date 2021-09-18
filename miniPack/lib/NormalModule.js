class NormalModule {
  constructor (data) {
    this.name = data.name
    this.entry = data.entry
    this.rawRequest = data.rawRequest
    // TODO: 等待完成
    this.parser = data.parser
    this.resource = data.resource
    // 存放某个模块的源代码
    this._source
    // 存放某个模块源代码对应的 ast
    this._ast
  }

  build (compilation, callback) {
    // 从文件中读取到将来需要被加载的 module 内容
    // 如果当前不是 js 模块，需要 loader 进行处理，最终返回 js 模块
    // 上述操作完成后，js 代码会被转换为 ast 语法树
    // 当前 js 模块内部可能又引用了其他模块，需要递归完成
    // 前面的完成之后，只需要重复执行即可
    this.doBuild(compilation, (err) => {
      this._ast = this.parser.parse(this._source)
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

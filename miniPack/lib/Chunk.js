class Chunk {
  constructor (entryModule) {
    this.entryModule = entryModule
    this.name = entryModule.name
    // chunk 最终生成文件的文件名称列表，记录每个 chunk 的文件信息
    this.files = []
    // chunk 中包含的所有模块，记录每个 chunk 里所包含的 module
    this.modules = []
  }
}

module.exports = Chunk

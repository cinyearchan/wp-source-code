// 借助 babylon 实现源码到 ast 的转换
const babylon = require('babylon')
const { Tapable } = require('tapable')

class Parser extends Tapable {
  parse (source) {
    return babylon.parse(source, {
      sourceType: 'module',
      plugins: ['dynamicImport'] // 当前插件支持 import() 动态导入语法
    })
  }
}

module.exports = Parser

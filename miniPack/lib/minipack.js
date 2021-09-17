const Compiler = require('./Compiler')
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')

const minipack = function (options) {
  // 校验 options，当前可省略
  // 实例化 compiler 对象
  let compiler = new Compiler(options.context)
  compiler.options = options // 保存用户传入的 配置选项 options

  // 初始化 NodeEnvironmentPlugin 让 compiler 具有文件读写能力
  new NodeEnvironmentPlugin().apply(compiler)

  // 给 compiler 对象挂载所有 plugins 插件
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler)
    }
  } 

  // 给 compiler 挂载所有的内置插件（处理入口文件的插件最重要）
  // 原版实现 compiler.options = new WebpackOptionsApply().process(options, compiler)

  // 返回 compiler 对象
  return compiler
}

module.exports = minipack

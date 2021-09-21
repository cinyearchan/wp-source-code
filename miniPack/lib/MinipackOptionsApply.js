const EntryOptionPlugin = require('./EntryOptionApply')

class MinipackOptionsApply {
  process (options, compiler) {
    new EntryOptionPlugin().apply(compiler)
    compiler.hooks.entryOption.call(options.context, options.entry)

    return options
  }
}

module.exports = MinipackOptionsApply

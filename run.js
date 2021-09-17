// let webpack = require('webpack')
let minipack = require('./minipack')
let options = require('./webpack.config')

// let compiler = webpack(options)
let compiler = minipack(options)

compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson({
    entries: true,
    chunks: false,
    modules: false,
    assets: false
  }))
})

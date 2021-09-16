(function (modules) {
  // 15 定义 webpackJsonpCallback 实现：合并“模块定义”，改变 promise 状态，执行后续行为
  function webpackJsonpCallback (data) {
    // 以 login.built.js 为例，data 的内容应该是
    /**
     * [["login"], { "./src/login.js": (function (module, exports) { module.exports = "懒加载导出内容" }) }]
     */
    // 获取需要被动态加载的模块 id
    let chunkIds = data[0] // ["login"]
    // 获取需要被动态加载的模块依赖关系对象
    let moreModules = data[1] // { "./src/login.js": (function (module, exports) { module.exports = "懒加载导出内容" }) }

    let chunkId, resolves = []
    // 循环判断 chunkIds 里对应的模块内容是否已经完成了加载
    for (let i = 0; i < chunkIds.length; i++) {
      chunkId = chunkIds[i] // "login"
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) { // 不是 0 null undefined，说明模块正在加载
        // installedChunks[chunkId]  ->   [resolve, reject, 完整的 promise]
        resolves.push(installedChunks[chunkId][0])
      }
      // 更新当前的 chunk 状态
      installedChunks[chunkId] = 0 // 标记为“完成加载”
    }

    // 将动态加载的模块合并到 modules 中
    for (moduleId in moreModules) {
      // 将 { "./src/login.js": (function (module, exports) { module.exports = "懒加载导出内容" }) } 合并到最开始的 modules 中
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId]
      }
    }

    while (resolves.length) {
      resolves.shift()() // ----> resolve()  -----> chunkId 对应的 promise 变为成功态
    }
  }

  // 1 定义对象用于缓存被加载过的模块
  let installedModules = {}

  // 16 定义 installedChunks 用于标识某个 chunkId 对应的 chunk 是否完成了加载
  let installedChunks = {
    main: 0
  }

  // 2 定义 __webpack_require__ 方法用于替换 import require 加载操作
  function __webpack_require__ (moduleId) {
    // 判断当前缓存中是否存在要被加载的模块，如果存在则直接返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId]
    }

    // 如果当前缓存中不存在该模块，手动定义对象并加载被导入的模块内容
    let module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }

    // 调用该模块 moduleId 对应的函数，完成内容的加载
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

    // 上述方法调用完成后，修改 mdoule.l 的值，标识该模块已被加载
    module.l = true

    // 加载完成之后，返回获取到的模块内容给 __webpack_require__ 的调用位置
    return module.exports
  }

  // 3 定义 m 属性用于保存 modules
  __webpack_require__.m = modules

  // 4 定义 c 属性用于保存 cache
  __webpack_require__.c = installedModules

  // 5 定义 o 方法用于判断对象是否存在执行的属性
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty(object, property)
  }

  // 6 定义 d 方法用于给对象添加指定的属性，同时给该属性设置 getter
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter })
    }
  }

  // 7 定义 r 方法用于标识当前模块是 es6 类型 esModule
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    }
    Object.defineProperty(exports, '__esModule', { value: true })
  }

  // 8 定义 n 方法用于设置具体的 getter
  __webpack_require__.n = function (module) {
    let getter = module && module.__esModule ?
      function getDefault () { return module['default'] } :
      function getModuleExports () { return module }

    __webpack_require__.d(getter, 'a', getter)
  }

  // 18 定义 jsonpScriptSrc 用于实现 src 的处理
  function jsonpScriptSrc (chunkId) { // 加空字符串 "" 是为了防止返回值被 chunkId 变为数字
    return __webpack_require__.p + "" + chunkId + '.built.js'
  }

  // 17 定义 e 方法用于：实现jsonp加载内容；使用 promise 实现异步加载操作
  __webpack_require__.e = function (chunkId) {
    // 定义数组用于存放 promise
    let promises = []

    // 获取 chunkId 对应的 chunk 是否已经完成了加载
    let installedChunkData = installedChunks[chunkId]

    // 依据当前是否已完成加载的状态来执行后续的操作
    if (installedChunkData !== 0) { // null undefined promise
      if (installedChunkData) { // promise
        promises.push(installedChunkData[2])
      } else { // null undefined 说明还没有加载
        let promise = new Promise((resolve, reject) => {
          installedChunkData = installedChunks[chunkId] = [resolve, reject]
        })

        promises.push(installedChunkData[2] = promise)

        // JSONP 部分
        // 创建标签
        let script = document.createElement('script')
        // 设置 src
        script.src = jsonpScriptSrc(chunkId)
        // 写入 script 标签
        document.head.appendChild(script)
      }
    }

    // 执行 promise
    return Promise.all(promises)
  }

  // 11 定义 t 方法用于加载指定 value 的模块内容，之后对内容进行处理再返回
  __webpack_require__.t = function (value, mode) {
    // 加载 value 对应的模块内容——value 一般就是模块 id
    // 加载之后的内容又重新赋值给 value 变量
    if (mode & 1) {
      value = __webpack_require__(value)
    }
    
    if (mode & 8) { // 加载了可以直接返回使用的内容
      return value
    }

    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) {
      return value
    }

    // 如果 8 4 都不成立，使用自定义 ns 通过 default 属性返回内容
    let ns = Object.create(null)

    __webpack_require__.r(ns)

    Object.defineProperty(ns, 'default', { enumerable: true, value: value })

    if (mode & 2 && typeof value !== 'string') {
      for (var key in value) {
        __webpack_require__.d(ns, key, function (key) {
          return value[key]
        }.bind(null, key))
      }
    }

    return ns
  }

  // 12 定义变量存放数组
  let jsonpArray = window['webpackJsonp'] = window['webpackJsonp'] || []

  // 13 保存原生的 push 方法
  let oldJsonpFunction = jsonpArray.push.bind(jsonpArray)

  // 14 重写原生的 push 方法
  jsonpArray.push = webpackJsonpCallback

  // 9 定义 p 属性用于保存资源访问路径
  __webpack_require__.p = ""

  // 10 调用 __webpack_require__ 方法执行模块导入与加载操作
  return __webpack_require__(__webpack_require__.s = "./src/index.js")
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    let oBtn = document.getElementById("btn");
    oBtn.addEventListener("click", function () {
      __webpack_require__
        .e(/*! import() | login */ "login")
        .then(
          __webpack_require__.t.bind(
            null,
            /*! ./login.js */ "./src/login.js",
            7
          )
        )
        .then((login) => {
          console.log(login);
        });
    });
    console.log("index.js 内容执行了");
  },
})
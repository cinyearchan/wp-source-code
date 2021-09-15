(function (modules) {
  // 1 定义对象用于缓存被加载过的模块
  let installedModules = {}

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
      Object.defineProperty(epxorts, Symbol.toStringTag, { value: "Module" })
    }
    Object.defineProperty(epxorts, '__esModule', { value: true })
  }

  // 8 定义 n 方法用于设置具体的 getter
  __webpack_require__.n = function (module) {
    let getter = module && module.__esModule ?
      function getDefault () { return module['default'] } :
      function getModuleExports () { return module }

    __webpack_require__.d(getter, 'a', getter)
  }

  // 9 定义 p 属性用于保存资源访问路径
  __webpack_require__.p = ""

  // 10 调用 __webpack_require__ 方法执行模块导入与加载操作
  return __webpack_require__(__webpack_require__.s = "./src/index.js")
})({
  "./src/index.js": (function (module, exports, __webpack_require__) {
    let name = __webpack_require__("./src/login.js")
    console.log('index.js 内容执行了')
    console.log(name)
  }),
  "./src/login.js": (function (module, exports, __webpack_require__) {
    module.exports = '测试模块'
  })
})
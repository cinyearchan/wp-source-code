(function (modules) {
  // 1 定义对象用于缓存被加载过的模块
  let installedModules = {}

  // 2 定义 __webpack_require__ 方法用于替换 import require 加载操作
  function __webpack_require__ (moduleId) {}

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
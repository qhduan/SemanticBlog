/**
 * 程序入口
 * babel-register是为了程序可以以es2015的语法运行
 * 然后调用服务端组件./server/index.js
 * @author qhduan@memect.co
 */


"use strict";

require("babel-register");
require("babel-polyfill");

// 定义lodash
global._ = require("lodash");

require("./server");

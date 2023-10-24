"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SystemConfig = void 0;

var _env = require("../utils/env");

class SystemConfig {
  static configFileName = (0, _env.setConfigFileName)();
  static isQingLongPanel = (0, _env.isQingLongPanel)();
}

exports.SystemConfig = SystemConfig;
var _default = SystemConfig;
exports.default = _default;
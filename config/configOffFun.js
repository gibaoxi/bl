"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offFunctions = offFunctions;

var _globalVar = require("./globalVar");

var _funcConfig = _interopRequireDefault(require("./funcConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function funHandle() {
  for (const funName in _funcConfig.default) {
    if (Object.prototype.hasOwnProperty.call(_funcConfig.default, funName)) {
      const el = _funcConfig.default[funName];
      const taskFunction = _globalVar.TaskConfig.config.function || {};

      switch (taskFunction[funName]) {
        case true:
          el === false && (_funcConfig.default[funName] = true);
          break;

        case false:
          el === true && (_funcConfig.default[funName] = false);
          break;

        default:
          break;
      }
    }
  }

  if (!_funcConfig.default.addCoins && !_funcConfig.default.shareAndWatch) {
    _funcConfig.default.taskReward = false;
  }
}

function offFunctions(funArr) {
  funHandle();
  return funArr.map(el => _funcConfig.default[el.name] ? el : null).filter(el => el);
}
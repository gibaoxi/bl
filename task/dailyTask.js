"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dailyTasks = dailyTasks;

var _configOffFun = require("../config/configOffFun");

var _utils = require("../utils");

var _index = _interopRequireWildcard(require("./index"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function dailyTasks(cb, ...cbArg) {
  try {
    await (0, _index.loginTask)();
  } catch (error) {
    _utils.logger.error(`登录失败: ${error}`);

    await (0, _utils.sendMessage)('登录失败', _utils.LogMessage.value);
    return '未完成';
  }

  const biliArr = (0, _configOffFun.offFunctions)([...Object.values(_index.default)]);

  for (const asyncFun of biliArr) {
    await asyncFun();
    await (0, _utils.apiDelay)();
  }

  cb && (await cb(...cbArg));
  await (0, _utils.sendMessage)('每日完成', _utils.LogMessage.value);
  return '完成';
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiDelay = apiDelay;
exports.printVersion = printVersion;
exports.sendMessage = sendMessage;

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

var _log = require("./log");

var _globalVar = require("../config/globalVar");

var _pure = require("./pure");

var _sendNotify = require("./sendNotify");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function printVersion() {
  try {
    const version = fs.readFileSync(path.resolve(__dirname, '../version.txt'), 'utf8').trim();

    if (version) {
      _log.logger.info(`当前版本【${version}】`);
    }
  } catch {}
}

async function sendMessage(title, text) {
  _log.logger.info('----【消息推送】----');

  title = `Bili-${_globalVar.TaskConfig.NICKNAME}-${title}`;
  await (0, _sendNotify.sendNotify)(title, text, undefined, '');
}

function apiDelay(delayTime) {
  const API_DELAY = _globalVar.TaskConfig.BILI_API_DELAY;
  let delay;

  if (API_DELAY.length === 1) {
    delay = API_DELAY[0] * 1000;
  } else {
    delay = (0, _pure.random)(API_DELAY[0] || 2, API_DELAY[1] || 6) * 1000;
  }

  delay = delayTime || delay;
  const startTime = new Date().getTime() + parseInt(delay, 10);

  while (new Date().getTime() < startTime) {}

  return new Promise(resolve => {
    resolve('done');
  });
}
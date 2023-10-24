"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dailyHandle = dailyHandle;
exports.liveHeartHandle = liveHeartHandle;

var _pure = require("./pure");

var _dailyTask = require("../task/dailyTask");

var _liveHeart = require("../task/liveHeart");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getPayload(slsType, event) {
  return slsType === 'scf' ? event.Message : event.payload;
}

async function getUpdateTrigger(slsType, event, context) {
  const caller = slsType === 'scf' ? (await Promise.resolve().then(() => _interopRequireWildcard(require('./updateScfTrigger')))).default : (await Promise.resolve().then(() => _interopRequireWildcard(require('./updateFcTrigger')))).default;
  return (...args) => caller(event, context, ...args);
}

async function dailyHandle({
  event,
  context,
  slsType
}) {
  const payload = getPayload(slsType, event),
        updateTrigger = await getUpdateTrigger(slsType, event, context);
  let message;

  try {
    message = JSON.parse(payload);
  } catch (error) {}

  if (message && message.lastTime === (0, _pure.getPRCDate)().getDate().toString()) {
    return '今日重复执行';
  }

  return await (0, _dailyTask.dailyTasks)(updateTrigger);
}

async function liveHeartHandle({
  event,
  context,
  slsType
}) {
  const payload = getPayload(slsType, event),
        updateTrigger = await getUpdateTrigger(slsType, event, context);
  let message;

  try {
    message = JSON.parse(payload);
  } catch (error) {}

  if (message && !message.d && message.lastTime === (0, _pure.getPRCDate)().getDate().toString()) {
    return '今日重复执行';
  }

  const data = await (0, _liveHeart.liveHeartBySCF)(payload);

  if (data === 0) {
    await updateTrigger();
    return '今日完成';
  }

  if (data === 1) {
    await updateTrigger({
      hn: {
        v: 0
      },
      d: [{
        seq: {
          v: 0
        }
      }]
    }, (0, _pure.setCron)(5000));
    return '等待继续下一轮心跳';
  }

  await updateTrigger(data, (0, _pure.setCron)(62000 - data.l * 1000));
  return '等待继续下次心跳';
}
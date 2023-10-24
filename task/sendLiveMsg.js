"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = liveSendMessage;

var _utils = require("../utils");

var liveRequest = _interopRequireWildcard(require("../net/live.request"));

var _globalVar = require("../config/globalVar");

var _log = require("../utils/log");

var _constant = require("../constant");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const messageArray = _constant.kaomoji.concat('1', '2', '3', '4', '5', '6', '7', '8', '9', '签到', '哈哈');

async function getFansMedalPanel() {
  try {
    const {
      code,
      message,
      data
    } = await liveRequest.getFansMedalPanel(1, 256, _globalVar.TaskConfig.USERID);

    if (code !== 0) {
      _log.logger.verbose(`获取勋章信息失败 ${code} ${message}`);

      return null;
    }

    return data;
  } catch (error) {
    _log.logger.error(`获取勋章异常 ${error.message}`);

    return null;
  }
}

async function getFansMealList() {
  const {
    list,
    special_list
  } = await getFansMedalPanel();
  list.push(...special_list);
  return list;
}

async function sendOneMessage(roomid, targetName) {
  const msg = messageArray[(0, _utils.random)(messageArray.length - 1)];

  try {
    const {
      code,
      message
    } = await liveRequest.sendMessage(roomid, msg);

    if (code !== 0) {
      if (code === 11000) {
        _log.logger.warn(`【${targetName}】${roomid}-可能未开启评论`);

        return false;
      }

      _log.logger.warn(`【${targetName}】${roomid}-发送失败 ${message}`);

      _log.logger.verbose(`code: ${code}`);

      return false;
    }

    return true;
  } catch (error) {
    _log.logger.verbose(`发送弹幕异常 ${error.message}`);
  }
}

async function liveSendMessage() {
  _log.logger.info('----【发送直播弹幕】----');

  const fansMedalList = await getFansMealList();
  const fansMedalLength = fansMedalList.length;
  let count = 0,
      jumpCount = 0;

  _log.logger.info(`一共需要发送${fansMedalLength}个直播间`);

  _log.logger.verbose(`所需时间可能很长，请耐心等待`);

  for (let i = 0; i < fansMedalLength; i++) {
    const {
      room_info,
      anchor_info,
      medal
    } = fansMedalList[i];

    if (!(room_info !== null && room_info !== void 0 && room_info.room_id)) {
      _log.logger.info(`【${anchor_info.nick_name}】没有直播间哦`);

      jumpCount++;
      continue;
    }

    if (medal.today_feed === 100) {
      jumpCount++;
      continue;
    }

    if (await sendOneMessage(room_info.room_id, anchor_info.nick_name)) count++;
    if (i < fansMedalLength - 1) await (0, _utils.apiDelay)((0, _utils.random)(10000, 25000));
  }

  _log.logger.info(`成功发送${count}个弹幕，跳过${jumpCount}个`);
}
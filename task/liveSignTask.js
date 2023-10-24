"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = liveSignTask;

var _log = require("../utils/log");

var _live = require("../net/live.request");

async function liveSignTask() {
  _log.logger.info('----【直播签到】----');

  try {
    const {
      data
    } = await (0, _live.webGetSignInfo)();

    if (data.status === 1) {
      _log.logger.info('已签到，跳过签到');

      _log.logger.info(`已经签到${data.hadSignDays}天，${data.specialText}`);

      return;
    }
  } catch (error) {}

  try {
    const {
      code,
      data,
      message
    } = await (0, _live.doLiveSign)();

    if (code === 0) {
      _log.logger.info(`直播签到成功: ${data.text}，特别信息: ${data.specialText}，本月签到天数: ${data.hadSignDays}天;`);
    } else {
      _log.logger.warn(`直播签到失败: ${code} ${message}`);
    }
  } catch (error) {
    _log.logger.error(`直播签到异常: ${error.message}`);
  }
}
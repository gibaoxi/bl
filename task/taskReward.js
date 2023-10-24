"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = taskReward;

var _userInfo = require("../net/user-info.request");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _log = require("../utils/log");

async function taskReward() {
  _log.logger.info('----【每日任务完成情况】----');

  try {
    const {
      data,
      message,
      code
    } = await (0, _userInfo.getDailyTaskRewardInfo)();
    await (0, _utils.apiDelay)();
    const {
      data: coinExp
    } = await (0, _userInfo.getDonateCoinExp)();

    if (code != 0) {
      _log.logger.warn(`状态获取失败: ${code} ${message}`);

      return;
    }

    const targetCoinsDiff = _globalVar.TaskModule.money - _globalVar.TaskConfig.BILI_STAY_COINS;
    let coins = 0;

    if (_globalVar.TaskModule.coinsTask === 0) {
      _log.logger.info(`今日投币获取经验: ${coinExp}，还需投币0颗，经验够了，不想投了`);
    } else if (targetCoinsDiff <= 0) {
      _log.logger.info(`今日投币获取经验: ${coinExp}，还需投币0颗，硬币不够了，不投币了`);
    } else if (targetCoinsDiff < _globalVar.TaskModule.coinsTask) {
      coins = _globalVar.TaskModule.coinsTask - targetCoinsDiff;

      _log.logger.info(`投币获取经验: ${coinExp}，还需投币数量: ${coins}颗;(目标${_globalVar.TaskModule.coinsTask}颗，忽略部分投币)`);
    } else {
      coins = _globalVar.TaskModule.coinsTask - coinExp / 10;

      _log.logger.info(`投币获取经验: ${coinExp}，还需投币数量: ${coins}颗;(目标${_globalVar.TaskModule.coinsTask}颗)`);
    }

    _globalVar.TaskModule.coinsTask = coins;

    _log.logger.info(`每日分享: ${data.share ? '已完成' : '[未完成]'}`);

    _log.logger.info(`每日播放: ${data.watch ? '已完成' : '[未完成]'}`);

    _globalVar.TaskModule.share = data.share;
    _globalVar.TaskModule.watch = data.watch;
  } catch (error) {
    _log.logger.error(`状态获取异常 ${error.message}`);
  }
}
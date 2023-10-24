"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addCoins;

var _userInfo = require("../net/user-info.request");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _coin = require("../service/coin.service");

async function addCoins() {
  _utils.logger.info('----【视频投币】----');

  if (!_globalVar.TaskModule.coinsTask) {
    _utils.logger.info('跳过投币，今日已完成');

    return;
  }

  const state = {
    eCount: 0,
    num: 0,
    prevCode: 0,
    fillCount: 0,
    priority: 0
  };
  let isReturn = false;

  while (_globalVar.TaskModule.coinsTask && !isReturn && state.eCount < 5) {
    isReturn = await coinHandle(state);
  }

  if (state.eCount >= 5) _utils.logger.info(`出现异常/错误5次，自动退出投币`);

  _utils.logger.info(`一共成功投币${state.num}颗`);

  _utils.logger.info(`硬币还剩${_globalVar.TaskModule.money}颗`);
}

async function coinHandle(state) {
  await setCoinsTask();

  if (_globalVar.TaskModule.coinsTask <= 0 || _globalVar.TaskModule.money <= 0) {
    return true;
  }

  const {
    data,
    msg
  } = await (0, _coin.getAidByByPriority)(state.priority);

  if (!(data !== null && data !== void 0 && data.id) || msg != '0') {
    state.eCount++;
    return false;
  }

  await (0, _utils.apiDelay)();
  return await coinToIdOnce(data, state);
}

async function setCoinsTask() {
  try {
    const {
      data: coinExp,
      code
    } = await (0, _userInfo.getDonateCoinExp)();

    if (code == 0) {
      const coins = _globalVar.TaskConfig.BILI_TARGET_COINS - coinExp / 10;
      _globalVar.TaskModule.coinsTask = coins > 0 ? coins : 0;
    }
  } catch (error) {}
}

async function coinToIdOnce(data, state) {
  const {
    id,
    title,
    author,
    type,
    mid
  } = data;

  try {
    const coinData = await (0, _coin.coinToId)({
      id,
      type,
      mid
    });

    if (coinData.code === 0) {
      _globalVar.TaskModule.money--;
      _globalVar.TaskModule.coinsTask--;
      state.num++;

      _utils.logger.info(`给[${title}--up【${author}】]投币成功`);
    } else if (coinData.code === 34005) {
      state.fillCount++;

      _utils.logger.verbose(`当前稿件[${id}]不能再投币了`);

      if (state.fillCount >= 3) {
        _utils.logger.warn(`自定义用户组投币似乎没有币可投了`);

        state.priority++;
      }
    } else if (coinData.code === -111 || coinData.code === -104) {
      _utils.logger.warn(`${id} ${coinData.message} 无法继续进行投币`);

      return true;
    } else {
      state.eCount++;

      _utils.logger.warn(`给${id}投币失败 ${coinData.code} ${coinData.message}`);

      if (state.prevCode === coinData.code) {
        return true;
      }

      state.prevCode = coinData.code;
    }
  } catch (error) {
    state.eCount++;

    _utils.logger.error(`投币异常 ${error.message}`);
  } finally {
    await (0, _utils.apiDelay)(1500);
  }

  return false;
}
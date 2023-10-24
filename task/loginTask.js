"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loginTask;

var _userInfo = require("../net/user-info.request");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _funcConfig = require("../config/funcConfig");

var _log = require("../utils/log");

function estimatedDays(upLevelExp) {
  if (_globalVar.TaskConfig.BILI_TARGET_COINS <= 0) return upLevelExp / 15;
  const dailyExp = _globalVar.TaskConfig.BILI_TARGET_COINS * 10 + 15;
  const idealDays = upLevelExp / dailyExp;
  const coinSupportDays = _globalVar.TaskModule.money / (_globalVar.TaskConfig.BILI_TARGET_COINS - 1);
  if (idealDays < coinSupportDays) return Math.floor(idealDays);
  const needExp = upLevelExp - coinSupportDays * dailyExp;
  return needExp / 25 + coinSupportDays;
}

function setLevelInfo(data) {
  const levelInfo = data.level_info;
  const currentLevel = levelInfo.current_level;

  if (currentLevel >= _globalVar.TaskConfig.BILI_TARGET_LEVEL) {
    _globalVar.TaskModule.coinsTask = 0;
  }

  _log.logger.info(`当前等级: ${levelInfo.current_level}`);

  if (currentLevel >= 6) {
    _funcConfig.functionConfig.shareAndWatch = false;
    _funcConfig.functionConfig.addCoins = false;

    _log.logger.info('已经满级，不需要再投币了，做个白嫖怪吧');
  } else {
    const upLevelExp = levelInfo.next_exp - levelInfo.current_exp;

    _log.logger.info(`距离升级还需要 ${upLevelExp} 经验，预计 ${estimatedDays(upLevelExp).toFixed(2)} 天`);
  }
}

function setVipStatus(data) {
  let vipTypeMsg = '';
  _globalVar.TaskModule.vipType = data.vipType;

  switch (data.vipType) {
    case 0:
      vipTypeMsg = '无大会员';
      break;

    case 1:
      vipTypeMsg = '月度大会员';
      break;

    case 2:
      vipTypeMsg = '年度大会员';
      break;

    default:
      break;
  }

  if (data.vipStatus === 0) {
    vipTypeMsg = vipTypeMsg === '无大会员' ? vipTypeMsg : vipTypeMsg + '[已过期]';
  }

  _log.logger.info(`大会员状态: ${vipTypeMsg}`);
}

function conciseNickname(nickname) {
  const length = nickname.length;

  if (length <= 3) {
    return nickname;
  }

  const firstWord = nickname[0];
  const lastWord = nickname[length - 1];
  return `${firstWord}**${lastWord}`;
}

async function setUserInfo(data) {
  try {
    var _data$wallet;

    const {
      data: coinBalance
    } = await (0, _userInfo.getCoinBalance)();

    _log.logger.info(`登录成功: ${data.uname}`);

    _log.logger.info(`硬币余额: ${coinBalance.money || 0}`);

    _globalVar.TaskConfig.NICKNAME = conciseNickname(data.uname);
    _globalVar.TaskModule.money = coinBalance.money || 0;
    _globalVar.TaskModule.bCoinCouponBalance = ((_data$wallet = data.wallet) === null || _data$wallet === void 0 ? void 0 : _data$wallet.coupon_balance) || 0;
    setLevelInfo(data);
    setVipStatus(data);
  } catch (error) {
    _log.logger.error(`获取硬币信息异常: ${error.message}`);
  }
}

async function loginTask() {
  _log.logger.info('----【登录】----');

  try {
    const {
      data,
      message,
      code
    } = await (0, _userInfo.loginByCookie)();

    if (code === 65006 || code === -404) {
      _log.logger.error(`登录错误 ${code} ${message}`);

      return;
    } else if (code !== 0) {
      _log.logger.error(`登录错误 ${code} ${message}`);

      return;
    }

    if (!data.isLogin) {
      throw new Error('接口返回为未登录');
    }

    await (0, _utils.apiDelay)();
    await setUserInfo(data);
  } catch (error) {
    throw new Error(error.message);
  }
}
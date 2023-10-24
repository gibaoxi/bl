"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskModule = exports.TaskConfig = void 0;
exports.initialize = initialize;

var _cookie = require("../utils/cookie");

var _setConfig = require("./setConfig");

function strArr2numArr(strArr) {
  return strArr && strArr.map(str => Number(str)).filter(num => num > 0 && num % 1 === 0);
}

class TaskConfigTemplate {
  constructor(config) {
    var _config$targetCoins, _config$targetLevel, _config$stayCoins, _config$message, _config$matchCoins, _config$matchSelectio, _config$matchDiff, _config$message2;

    this.config = config;
    this.COOKIE = config.cookie;
    this.BILIJCT = (0, _cookie.getBiliJct)(config.cookie);
    this.NICKNAME = '';
    this.USERID = (0, _cookie.getUserId)(config.cookie);
    this.USER_AGENT = config.userAgent;
    this.BILI_TARGET_COINS = (_config$targetCoins = config.targetCoins) !== null && _config$targetCoins !== void 0 ? _config$targetCoins : 5;
    this.BILI_API_DELAY = Array.isArray(this.biliApiDelay) ? this.biliApiDelay : [this.biliApiDelay];
    this.BILI_CUSTOMIZE_UP = strArr2numArr(config.customizeUp) || [];
    this.BILI_GIFT_UP = strArr2numArr(config.giftUp) || this.BILI_CUSTOMIZE_UP || [];
    this.BILI_TARGET_LEVEL = (_config$targetLevel = config.targetLevel) !== null && _config$targetLevel !== void 0 ? _config$targetLevel : 6;
    this.BILI_STAY_COINS = (_config$stayCoins = config.stayCoins) !== null && _config$stayCoins !== void 0 ? _config$stayCoins : 0;
    this.BILI_UPPER_ACC_MATCH = config.upperAccMatch || true;
    this.BILI_COIN_RETRY_NUM = config.coinRetryNum || 4;
    this.CHARGE_ID = config.chargeUpId || this.USERID;
    this.CHARGE_PRESET_TIME = config.chargePresetTime || 31;
    this.PUSHPLUS_TOKEN = process.env.PUSHPLUS_TOKEN || ((_config$message = config.message) === null || _config$message === void 0 ? void 0 : _config$message.pushplusToken);
    this.MATCH_COINS = (_config$matchCoins = config.matchCoins) !== null && _config$matchCoins !== void 0 ? _config$matchCoins : 5;
    this.MATCH_SELECTION = (_config$matchSelectio = config.matchSelection) !== null && _config$matchSelectio !== void 0 ? _config$matchSelectio : 1;
    this.MATCH_DIFF = (_config$matchDiff = config.matchDiff) !== null && _config$matchDiff !== void 0 ? _config$matchDiff : 0;
    this.MESSAGE_API = (_config$message2 = config.message) === null || _config$message2 === void 0 ? void 0 : _config$message2.api;
  }

}

let _taskConfig;

const TaskConfig = new Proxy({}, {
  get(_target, key) {
    if (!_taskConfig) {
      initialize();
    }

    return Reflect.get(_taskConfig, key);
  },

  set(_target, key, value) {
    if (key === 'config') {
      initialize(value);
    }

    return Reflect.set(_taskConfig, key, value);
  }

});
exports.TaskConfig = TaskConfig;

class TaskModule {
  static money = 0;
  static coinsTask = 5;
  static share = false;
  static watch = false;
  static currentStartFun = 0;
  static bCoinCouponBalance = 0;
  static vipType = 0;
}

exports.TaskModule = TaskModule;

function initialize(config) {
  if (!config) {
    config = (0, _setConfig.getConfig)();
  }

  _taskConfig = new TaskConfigTemplate((0, _setConfig.checkConfig)(config));
  TaskModule.coinsTask = _taskConfig.BILI_TARGET_COINS;
}
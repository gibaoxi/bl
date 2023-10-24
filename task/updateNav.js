"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.updateNav = updateNav;

var _globalVar = require("../config/globalVar");

var _userInfo = require("../net/user-info.request");

var _log = require("../utils/log");

function getBCoinBalance(data) {
  var _data$wallet;

  _globalVar.TaskModule.bCoinCouponBalance = ((_data$wallet = data.wallet) === null || _data$wallet === void 0 ? void 0 : _data$wallet.coupon_balance) || 0;
}

async function updateNav() {
  try {
    const {
      data,
      message,
      code
    } = await (0, _userInfo.loginByCookie)();

    if (code !== 0) {
      _log.logger.warn(`获取用户信息失败：${code} ${message}`);

      return;
    }

    getBCoinBalance(data);
  } catch (error) {
    _log.logger.error(`获取用户信息异常：${error.message}`);
  }
}

var _default = updateNav;
exports.default = _default;
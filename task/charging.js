"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = charging;

var _vip = require("../net/vip.request");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _updateNav = require("./updateNav");

var _constant = require("../constant");

var ChargeStatus;

(function (ChargeStatus) {
  ChargeStatus[ChargeStatus["\u6210\u529F"] = 4] = "\u6210\u529F";
  ChargeStatus[ChargeStatus["\u4F4E\u4E8E20\u7535\u6C60"] = -2] = "\u4F4E\u4E8E20\u7535\u6C60";
  ChargeStatus[ChargeStatus["B\u5E01\u4E0D\u8DB3"] = -4] = "B\u5E01\u4E0D\u8DB3";
})(ChargeStatus || (ChargeStatus = {}));

function init() {
  const nowTime = (0, _utils.getPRCDate)(),
        today = nowTime.getDate(),
        monthHasDays = (0, _utils.getMonthHasDays)(nowTime);
  const presetTime = _globalVar.TaskConfig.CHARGE_PRESET_TIME;

  if (_globalVar.TaskModule.bCoinCouponBalance < 2) {
    _utils.logger.info(`剩余券为${_globalVar.TaskModule.bCoinCouponBalance}，不足2跳过充电`);

    return false;
  }

  if (monthHasDays === today) {
    _utils.logger.info(`今天是最后一天了`);

    return true;
  }

  if (presetTime > today) {
    _utils.logger.info(`预设时间为${presetTime}，不符合条件`);

    return false;
  }

  return true;
}

async function charging() {
  _utils.logger.info('----【给目标充电】----');

  await (0, _updateNav.updateNav)();
  await (0, _utils.apiDelay)();

  if (!init()) {
    return;
  }

  try {
    const bp_num = _globalVar.TaskModule.bCoinCouponBalance || 0;
    const up_mid = _globalVar.TaskConfig.CHARGE_ID;
    let errorCount = 0;

    _utils.logger.info(`b 币券余额${bp_num}`);

    const run = async () => {
      const {
        code,
        message,
        data
      } = await (0, _vip.chargingForUp)(bp_num, true, up_mid);

      if (code !== 0) {
        _utils.logger.warn(`充电失败：${code} ${message}`);

        return;
      }

      _utils.logger.info(`【充值结果】${ChargeStatus[data.status]}`);

      if (data.status === ChargeStatus['成功']) {
        _globalVar.TaskModule.chargeOrderNo = data.order_no;
        await (0, _utils.apiDelay)();
        await chargeComments();
      }
    };

    _globalVar.TaskModule.chargeOrderNo = '';

    while (!_globalVar.TaskModule.chargeOrderNo) {
      await run();
      await (0, _utils.apiDelay)();

      if (errorCount++ > 2) {
        break;
      }
    }
  } catch (error) {
    _utils.logger.error(`充电出现异常：${error.message}`);
  }
}

async function chargeComments() {
  try {
    if (!_globalVar.TaskModule.chargeOrderNo) {
      return false;
    }

    const comment = _constant.defaultComments[(0, _utils.random)(0, _constant.defaultComments.length - 1)];

    const {
      code
    } = await (0, _vip.chargingCommentsForUp)(_globalVar.TaskModule.chargeOrderNo, comment);

    if (code === 0) {
      _utils.logger.info('留言成功！');
    }
  } catch {}
}
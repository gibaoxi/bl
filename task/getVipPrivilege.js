"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getVipPrivilege;

var _vip = require("../net/vip.request");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _log = require("../utils/log");

function init() {
  if (_globalVar.TaskModule.vipType !== 2) {
    _log.logger.info(`账号非年度大会员，不需要领取权益`);

    return false;
  }

  const nowTime = (0, _utils.getPRCDate)(),
        today = nowTime.getDate(),
        monthHasDays = (0, _utils.getMonthHasDays)(nowTime);

  if (today !== 1 && monthHasDays !== today) {
    _log.logger.info('今天非预订领取时间，跳过领取');

    return false;
  }

  return true;
}

function getPrivilegeName(type) {
  switch (type) {
    case 1:
      return 'B 币券';

    case 2:
      return '大会员优惠券';

    default:
      return '';
  }
}

async function getOnePrivilege(type) {
  try {
    const name = getPrivilegeName(type);
    const {
      code,
      message
    } = await (0, _vip.receiveVipPrivilege)(type);
    let status = '成功';

    if (code === 0) {
      status = `失败 ${message}`;
    }

    _log.logger.info(`领取${name} ${status}`);

    return true;
  } catch (error) {
    _log.logger.error(`领取权益出现异常：${error.message}`);
  }

  return false;
}

async function getPrivilege(type) {
  let errCount = 0,
      suc = false;

  while (!suc) {
    suc = await getOnePrivilege(type);

    if (errCount > 2) {
      break;
    }

    errCount++;
  }

  return suc;
}

async function getVipPrivilege() {
  _log.logger.info('----【领取大会员权益】----');

  if (!init()) {
    return;
  }

  await getPrivilege(1);
  await getPrivilege(2);
}
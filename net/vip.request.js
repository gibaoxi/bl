"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chargingCommentsForUp = chargingCommentsForUp;
exports.chargingForUp = chargingForUp;
exports.receiveVipPrivilege = receiveVipPrivilege;

var _qs = require("qs");

var _globalVar = require("../config/globalVar");

var _api = require("./api");

async function receiveVipPrivilege(type = 1) {
  const {
    data
  } = await _api.biliApi.post('/x/vip/privilege/receive', (0, _qs.stringify)({
    csrf: _globalVar.TaskConfig.BILIJCT,
    type
  }));
  return data;
}

async function chargingForUp(bp_num = 50, is_bp_remains_prior = true, up_mid = _globalVar.TaskConfig.USERID, otype = 'up', oid = up_mid) {
  const {
    data
  } = await _api.biliApi.post('/x/ugcpay/web/v2/trade/elec/pay/quick', (0, _qs.stringify)({
    csrf: _globalVar.TaskConfig.BILIJCT,
    bp_num,
    is_bp_remains_prior,
    up_mid,
    otype,
    oid
  }));
  return data;
}

async function chargingCommentsForUp(orderId, message = '支持大佬一波') {
  const {
    data
  } = await _api.biliApi.post('/x/ugcpay/trade/elec/message', (0, _qs.stringify)({
    csrf: _globalVar.TaskConfig.BILIJCT,
    message,
    order_id: orderId
  }));
  return data;
}
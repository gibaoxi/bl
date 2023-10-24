"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = silver2Coin;

var _log = require("../utils/log");

var _live = require("../net/live.request");

async function silver2Coin() {
  _log.logger.info('----【银瓜子兑换硬币】----');

  try {
    const {
      data,
      code,
      message
    } = await (0, _live.exchangeStatus)();

    if (code != 0) {
      _log.logger.info(`获取瓜子详情失败 ${message}`);
    }

    if (data.silver_2_coin_left === 0) {
      _log.logger.info('今日已兑换一次');
    } else if (data.silver < 700) {
      _log.logger.info('兑换失败，你瓜子不够了');
    } else {
      const {
        message
      } = await (0, _live.exchangeSilver2Coin)();

      _log.logger.info(message);

      await (0, _live.getMyWallet)();
    }
  } catch (error) {
    _log.logger.error(`操作异常 ${error.message}`);
  }
}
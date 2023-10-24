"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mangaSign;

var _log = require("../utils/log");

var _manga = require("../net/manga.request");

async function mangaSign() {
  _log.logger.info('----【漫画签到】----');

  try {
    const {
      code
    } = await (0, _manga.clockIn)();

    if (code == 0) {
      _log.logger.info('漫画签到成功');
    } else {
      _log.logger.warn('漫画签到失败');
    }
  } catch (error) {
    if (error.response.status === 400) {
      _log.logger.info('已经签到过了，跳过任务');
    } else {
      _log.logger.error(`漫画签到异常 ${error.message}`);
    }
  }
}
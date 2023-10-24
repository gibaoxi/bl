"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shareAndWatch;

var _utils = require("../utils");

var _video = require("../net/video.request");

var _coin = require("../service/coin.service");

var _globalVar = require("../config/globalVar");

var _log = require("../utils/log");

async function shareAndWatch() {
  _log.logger.info('----【分享/播放视频】----');

  if (_globalVar.TaskModule.share && _globalVar.TaskModule.watch) {
    _log.logger.info('已完成，跳过分享/播放');

    return;
  }

  let gAid = 0;

  try {
    let biliav = await (0, _coin.getAidByByPriority)();
    if (biliav.msg === '-1') biliav = await (0, _coin.getAidByRegionRank)();

    if (biliav.msg === '0') {
      const {
        id,
        author,
        title
      } = biliav.data;
      gAid = id;

      _log.logger.info(`获取视频: ${title} --up【${author}】`);
    } else {
      _log.logger.warn(`获取视频失败 ${biliav.msg}`);

      return false;
    }
  } catch (error) {
    _log.logger.error(`获取视频出现异常: ${error.message}`);

    return false;
  }

  if (!_globalVar.TaskModule.share) {
    await (0, _utils.apiDelay)();

    try {
      const {
        code,
        message
      } = await (0, _video.addShare)(gAid);

      if (code === 0) {
        _log.logger.info(`分享视频成功!`);
      } else {
        _log.logger.warn(`分享视频失败: ${code} ${message}`);
      }
    } catch (error) {
      _log.logger.error(`分享视频异常: ${error.message}`);
    }
  }

  if (!_globalVar.TaskModule.watch) {
    await (0, _utils.apiDelay)();

    try {
      const {
        code,
        message
      } = await (0, _video.uploadVideoHeartbeat)(gAid, (0, _utils.random)(4, 60));

      if (code === 0) {
        _log.logger.info(`播放视频成功!`);
      } else {
        _log.logger.warn(`播放视频失败: ${code} ${message}`);
      }
    } catch (error) {
      _log.logger.error(`播放视频异常: ${error.message}`);
    }
  }
}
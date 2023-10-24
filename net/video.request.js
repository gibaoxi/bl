"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addShare = addShare;
exports.donatedCoinsForVideo = donatedCoinsForVideo;
exports.getRegionRankingVideos = getRegionRankingVideos;
exports.uploadVideoHeartbeat = uploadVideoHeartbeat;

var _api = require("./api");

var _qs = require("qs");

var _globalVar = require("../config/globalVar");

async function addShare(aid) {
  const reqData = {
    csrf: _globalVar.TaskConfig.BILIJCT,
    aid
  };
  const {
    data
  } = await _api.biliApi.post('/x/web-interface/share/add', (0, _qs.stringify)(reqData));
  return data;
}

async function getRegionRankingVideos(rid = 1, day = 3) {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/ranking/region', {
    params: {
      rid,
      day
    }
  });
  return data;
}

async function donatedCoinsForVideo(aid) {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/archive/coins', {
    params: {
      aid
    }
  });
  return data;
}

async function uploadVideoHeartbeat(aid, playedTime) {
  const {
    data
  } = await _api.biliApi.post('/x/click-interface/web/heartbeat', (0, _qs.stringify)({
    aid,
    played_time: playedTime
  }));
  return data;
}
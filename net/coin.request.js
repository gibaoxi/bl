"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCoinForArticle = addCoinForArticle;
exports.addCoinForAudio = addCoinForAudio;
exports.addCoinForVideo = addCoinForVideo;
exports.getUserNavNum = getUserNavNum;
exports.getVideoRelation = getVideoRelation;
exports.getVideoStatus = getVideoStatus;
exports.searchArticlesByUpId = searchArticlesByUpId;
exports.searchAudiosByUpId = searchAudiosByUpId;
exports.searchVideosByUpId = searchVideosByUpId;

var _api = require("./api");

var _utils = require("../utils");

var _index = _interopRequireDefault(require("./index"));

var _qs = require("qs");

var _globalVar = require("../config/globalVar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getUserNavNum(mid) {
  const {
    data
  } = await _api.biliApi.get(`/x/space/navnum?mid=${mid}`);
  return data;
}

async function searchVideosByUpId(upId, pageSize = 30, pageNumber = 1, keyword = '') {
  const {
    data
  } = await _api.biliApi.get('/x/space/arc/search', {
    params: {
      jsonp: 'jsonp',
      order: 'pubdate',
      keyword,
      pn: pageNumber,
      tid: 0,
      ps: pageSize,
      mid: upId
    }
  });
  return data;
}

async function searchAudiosByUpId(uid, pageSize = 30, pageNumber = 1) {
  const {
    data
  } = await _api.biliApi.get('/audio/music-service/web/song/upper', {
    params: {
      jsonp: 'jsonp',
      order: 1,
      pn: pageNumber,
      ps: pageSize,
      uid
    }
  });
  return data;
}

async function searchArticlesByUpId(mid, pageSize = 12, pageNumber = 1) {
  try {
    const {
      data: jsonpText
    } = await _api.biliApi.get('/x/space/article', {
      params: {
        callback: '__test',
        jsonp: 'jsonp',
        sort: 'publish_time',
        pn: pageNumber,
        ps: pageSize,
        mid
      }
    });
    return (0, _utils.jsonp2Object)(jsonpText);
  } catch (error) {
    console.log(error);
  }
}

async function getVideoRelation(aid, bvid) {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/archive/relation', {
    params: {
      aid,
      bvid
    }
  });
  return data;
}

async function getVideoStatus(aid, bvid) {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/archive/stat', {
    params: {
      aid,
      bvid
    }
  });
  return data;
}

async function addCoinForVideo(aid, multiply, selectLike = 1) {
  const {
    data
  } = await _api.biliApi.post('/x/web-interface/coin/add', (0, _qs.stringify)({
    aid,
    multiply,
    selectLike,
    csrf: _globalVar.TaskConfig.BILIJCT
  }));
  return data;
}

async function addCoinForAudio(sid, coin = 1) {
  const {
    data
  } = await _index.default.post('https://www.bilibili.com/audio/music-service-c/web/coin/add', (0, _qs.stringify)({
    sid,
    multiply: coin,
    csrf: _globalVar.TaskConfig.BILIJCT
  }));
  return data;
}

async function addCoinForArticle(upid, aid, coin = 1) {
  const {
    data
  } = await _api.biliApi.post('/x/web-interface/coin/add', (0, _qs.stringify)({
    aid,
    upid,
    avtype: 2,
    multiply: coin,
    csrf: _globalVar.TaskConfig.BILIJCT
  }));
  return data;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoinBalance = getCoinBalance;
exports.getDailyTaskRewardInfo = getDailyTaskRewardInfo;
exports.getDonateCoinExp = getDonateCoinExp;
exports.getFollowings = getFollowings;
exports.getSpecialFollowings = getSpecialFollowings;
exports.getUser = getUser;
exports.getVideosByUpId = getVideosByUpId;
exports.loginByCookie = loginByCookie;

var _api = require("./api");

var _biliUri = require("../constant/biliUri");

async function loginByCookie() {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/nav', {
    retry: 3,
    headers: {
      Origin: _biliUri.OriginURLs.account
    }
  });
  return data;
}

async function getDailyTaskRewardInfo() {
  const {
    data
  } = await _api.biliApi.get('/x/member/web/exp/reward');
  return data;
}

async function getDonateCoinExp() {
  const {
    data
  } = await _api.biliApi.get('/x/web-interface/coin/today/exp');
  return data;
}

async function getCoinBalance() {
  const {
    data
  } = await _api.accountApi.get('/site/getCoin');
  return data;
}

async function getFollowings(vmid, pageNumber = 1, pageSize = 50, order = 'desc', order_type = 'attention') {
  const {
    data
  } = await _api.biliApi.get('/x/relation/followings', {
    params: {
      vmid,
      pn: pageNumber,
      ps: pageSize,
      order,
      order_type
    }
  });
  return data;
}

async function getSpecialFollowings(pageNumber = 1, pageSize = 50) {
  const {
    data
  } = await _api.biliApi.get('/x/relation/tag', {
    params: {
      tagid: -10,
      pn: pageNumber,
      ps: pageSize
    }
  });
  return data;
}

async function getVideosByUpId(upId, pageSize = 50) {
  const {
    data
  } = await _api.biliApi.get('/x/v2/medialist/resource/list', {
    params: {
      direction: false,
      mobi_app: 'web',
      type: 1,
      bvid: '',
      ps: pageSize,
      biz_id: upId
    }
  });
  return data;
}

async function getUser(mid) {
  const {
    data
  } = await _api.biliApi.get(`/x/space/acc/info?mid=${mid}&jsonp=jsonp`);
  return data;
}
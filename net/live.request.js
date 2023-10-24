"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doLiveSign = doLiveSign;
exports.exchangeSilver2Coin = exchangeSilver2Coin;
exports.exchangeStatus = exchangeStatus;
exports.getFansMedalPanel = getFansMedalPanel;
exports.getGiftBagList = getGiftBagList;
exports.getLiveFansMedal = getLiveFansMedal;
exports.getLiveRoomInfo = getLiveRoomInfo;
exports.getMyWallet = getMyWallet;
exports.sendBagGift = sendBagGift;
exports.sendMessage = sendMessage;
exports.webGetSignInfo = webGetSignInfo;

var _qs = require("qs");

var _api = require("./api");

var _globalVar = require("../config/globalVar");

var _utils = require("../utils");

var _biliUri = require("../constant/biliUri");

async function doLiveSign() {
  const {
    data
  } = await _api.liveApi.get('/xlive/web-ucenter/v1/sign/DoSign');
  return data;
}

async function webGetSignInfo() {
  const {
    data
  } = await _api.liveApi.get('/xlive/web-ucenter/v1/sign/WebGetSignInfo');
  return data;
}

async function exchangeSilver2Coin() {
  const {
    data
  } = await _api.liveApi.post('/xlive/revenue/v1/wallet/silver2coin', (0, _qs.stringify)({
    csrf_token: _globalVar.TaskConfig.BILIJCT,
    csrf: _globalVar.TaskConfig.BILIJCT
  }));
  return data;
}

async function exchangeStatus() {
  const {
    data
  } = await _api.liveApi.get('/xlive/revenue/v1/wallet/getStatus');
  return data;
}

async function getMyWallet() {
  const {
    data
  } = await _api.liveApi.get('/xlive/revenue/v1/wallet/myWallet?need_bp=1&need_metal=1&platform=pc');
  return data;
}

async function sendMessage(roomid, msg) {
  const csrf = _globalVar.TaskConfig.BILIJCT;
  const csrf_token = csrf;
  msg || (msg = (0, _utils.random)(10).toString());
  const {
    data
  } = await _api.liveApi.post('/msg/send', (0, _qs.stringify)({
    color: 5566168,
    fontsize: 25,
    mode: 1,
    msg,
    rnd: Date.now(),
    roomid,
    bubble: 0,
    csrf,
    csrf_token
  }));
  return data;
}

async function getFansMedalPanel(page = 1, pageSize = 256, mid = 1) {
  const {
    data
  } = await _api.liveApi.get(`/xlive/app-ucenter/v1/fansMedal/panel?page=${page}&page_size=${pageSize}&target_id=${mid}`);
  return data;
}

async function getGiftBagList(roomId = 3394945) {
  const time = new Date().getTime();
  const {
    data
  } = await _api.liveApi.get(`/xlive/web-room/v1/gift/bag_list?t=${time}&room_id=${roomId}`);
  return data;
}

async function getLiveFansMedal(pageNum = 1, pageSize = 10) {
  if (pageNum > 10) {
    pageNum = 10;
  }

  const {
    data
  } = await _api.liveApi.get(`/xlive/app-ucenter/v1/user/GetMyMedals?page=${pageNum}&page_size=${pageSize}`);
  return data;
}

async function getLiveRoomInfo(roomid) {
  const {
    data
  } = await _api.liveApi.get(`/room/v1/Room/get_info?room_id=${roomid}&from=room`);
  return data;
}

async function sendBagGift({
  ruid,
  gift_num,
  bag_id,
  gift_id,
  roomid
}) {
  const csrf = _globalVar.TaskConfig.BILIJCT;
  const csrf_token = csrf;
  const postData = (0, _qs.stringify)({
    gift_id,
    ruid,
    gift_num,
    bag_id,
    biz_id: roomid,
    rnd: new Date().getTime(),
    send_ruid: 0,
    storm_beat_id: 0,
    metadata: '',
    price: 0,
    visit_id: '',
    csrf,
    platform: 'pc',
    biz_code: 'Live',
    csrf_token,
    uid: _globalVar.TaskConfig.USERID
  });
  const {
    data
  } = await _api.liveApi.post('/xlive/revenue/v2/gift/sendBag', postData, {
    headers: {
      Origin: _biliUri.OriginURLs.live
    }
  });
  return data;
}
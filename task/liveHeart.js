"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.liveHeart = exports.default = liveHeart;
exports.liveHeartBySCF = liveHeartBySCF;
exports.runOneLoop = runOneLoop;

var crypto = _interopRequireWildcard(require("crypto"));

var _utils = require("../utils");

var _cookie = require("../utils/cookie");

var _globalVar = require("../config/globalVar");

var liveHeartRequest = _interopRequireWildcard(require("../net/live-heart.request"));

var liveRequest = _interopRequireWildcard(require("../net/live.request"));

var _log = require("../utils/log");

var _constant = require("../constant");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const HEART_MAX_NUM = 24;

function hmacs(hmacsData, rule) {
  const [parent_id, area_id, seq_id, room_id] = JSON.parse(hmacsData.id);
  const [buvid, uuid] = JSON.parse(hmacsData.device);
  const {
    ets,
    time,
    ts
  } = hmacsData;
  const newData = {
    platform: 'web',
    parent_id,
    area_id,
    seq_id,
    room_id,
    buvid,
    uuid,
    ets,
    time,
    ts
  };
  const key = hmacsData.benchmark;
  const HmacFuncString = ['MD5', 'SHA1', 'SHA256', 'SHA224', 'SHA512', 'SHA384'];
  let s = JSON.stringify(newData);

  for (const r of rule) {
    s = crypto.createHmac(HmacFuncString[r], key).update(s).digest('hex');
  }

  return s;
}

function createBaseData(roomid, areaid, parentid, uname, seq) {
  const csrf_token = (0, _cookie.getBiliJct)(_globalVar.TaskConfig.COOKIE),
        csrf = csrf_token;
  const device = [(0, _cookie.getLIVE_BUVID)(_globalVar.TaskConfig.COOKIE), (0, _utils.createUUID)()];
  return {
    ua: _globalVar.TaskConfig.USER_AGENT,
    id: [parentid, areaid, seq, roomid],
    csrf_token,
    csrf,
    device,
    uname
  };
}

async function heartBeat() {
  try {
    await liveHeartRequest.heartBeat();
  } catch {}
}

async function getHeartNum() {
  let giftNum = 0;

  try {
    var _data$list, _data$list2;

    const {
      data,
      code
    } = await (0, liveRequest.getGiftBagList)();

    if (code !== 0 || ((_data$list = data.list) === null || _data$list === void 0 ? void 0 : _data$list.length) <= 0) {
      return HEART_MAX_NUM;
    }

    (_data$list2 = data.list) === null || _data$list2 === void 0 ? void 0 : _data$list2.forEach(gift => {
      if (gift.gift_id === 30607) {
        const expire = (gift.expire_at * 1000 - new Date().getTime()) / _constant.MS2DATE;

        if (expire > 6 && expire <= 7) giftNum += gift.gift_num;
      }
    });

    if (giftNum >= HEART_MAX_NUM) {
      return 0;
    }

    return HEART_MAX_NUM - giftNum;
  } catch (error) {}

  return HEART_MAX_NUM;
}

async function getOneRoomInfo(roomid) {
  const {
    data: {
      area_id,
      parent_area_id,
      room_id
    }
  } = await liveRequest.getLiveRoomInfo(roomid);
  return {
    room_id,
    area_id,
    parent_area_id
  };
}

async function postE(baseDate, seq) {
  const postData = {
    id: JSON.stringify(baseDate.id),
    device: JSON.stringify(baseDate.device),
    ts: new Date().getTime(),
    is_patch: 0,
    heart_beat: '[]',
    ua: baseDate.ua,
    visit_id: '',
    csrf: baseDate.csrf,
    csrf_token: baseDate.csrf_token
  };

  try {
    const {
      data,
      code
    } = await liveHeartRequest.postE(postData);

    if (code === 0) {
      _log.logger.info(`进入【${baseDate.uname}】的直播间`);

      seq.v++;
      return data;
    }
  } catch (error) {
    _log.logger.verbose(error);
  }
}

async function postX(rData, baseData, seq) {
  if (seq.v > 6) {
    return;
  }

  const postData = {
    id: JSON.stringify(baseData.id),
    device: JSON.stringify(baseData.device),
    ets: rData.timestamp,
    benchmark: rData.secret_key,
    time: 60,
    ts: new Date().getTime(),
    ua: baseData.ua
  };
  const s = hmacs(postData, rData.secret_rule);

  try {
    const {
      data,
      code,
      message
    } = await liveHeartRequest.postX(Object.assign({
      visit_id: '',
      csrf: baseData.csrf,
      csrf_token: baseData.csrf_token,
      s
    }, postData));

    if (code === 0) {
      _log.logger.info(`向【${baseData.uname}】发送第${seq.v}次心跳`);

      seq.v++;
    } else {
      _log.logger.warn(`向【${baseData.uname}】发送第${seq.v}次心跳失败 ${code} ${message}`);
    }

    return data;
  } catch (error) {
    _log.logger.verbose(error);
  }
}

async function getFansMeal10(page = 1, pageSize = 10) {
  try {
    const {
      code,
      message,
      data
    } = await liveRequest.getLiveFansMedal(page, pageSize);

    if (code !== 0) {
      _log.logger.verbose(`获取直播间失败 ${code} ${message}`);

      return null;
    }

    return data;
  } catch (error) {
    _log.logger.verbose(`获取直播间异常 ${error.message}`);

    return null;
  }
}

async function getMoreFansMedal() {
  const {
    items: fansMedalList,
    page_info
  } = await getFansMeal10();
  let {
    total_page: totalpages
  } = page_info;

  if (totalpages && totalpages > 1) {
    totalpages = totalpages > 3 ? 3 : totalpages;

    for (let index = 2; index <= totalpages; index++) {
      const medalTemp = await getFansMeal10(index, 10);
      fansMedalList.push(...medalTemp.items);
    }
  }

  return fansMedalList;
}

async function getFansMedalList(more = true) {
  const heartNum = await getHeartNum();
  let items;

  if (more) {
    items = await getMoreFansMedal();
  } else {
    ({
      items
    } = await getFansMeal10());
  }

  return {
    fansMedalList: items,
    heartNum
  };
}

async function liveHeart() {
  _log.logger.info('----【直播心跳】----');

  const {
    heartNum,
    fansMedalList
  } = await getFansMedalList();
  const length = fansMedalList && fansMedalList.length;

  if (!length) {
    _log.logger.info('没有勋章列表');

    return;
  }

  const loopNum = Math.ceil(heartNum / length);

  for (let i = 0; i < loopNum; i++) {
    await runOneLoop(fansMedalList, heartNum);
  }

  _log.logger.info('完成');
}

async function runOnePost(baseData, rDataArr, j, seq) {
  if (seq.v && !rDataArr[j]) {
    return;
  }

  await heartBeat();
  await (0, _utils.apiDelay)(500);

  if (seq.v === 0) {
    rDataArr[j] = await postE(baseData, seq);
  } else {
    rDataArr[j] = await postX(rDataArr[j], baseData, seq);
  }

  return 'done';
}

async function runOneLoop(fansMedalList, heartNum) {
  const apiDelayTime = 2000;
  const rDataArray = [];
  let runTime = 0;

  for (let index = 0; index < 6; index++) {
    let count = 0;

    if (count >= heartNum) {
      break;
    }

    const length = fansMedalList.length;
    runTime = 0;

    for (let j = 0; j < length; j++) {
      if (count >= heartNum) {
        break;
      }

      const runStartTime = new Date().getTime();
      const funsMedalData = fansMedalList[j];
      const {
        roomid,
        uname
      } = funsMedalData;
      const {
        room_id,
        area_id,
        parent_area_id
      } = await getOneRoomInfo(roomid);
      const baseData = createBaseData(room_id, area_id, parent_area_id, uname, index);
      await runOnePost(baseData, rDataArray, j, {
        v: index
      });
      await (0, _utils.apiDelay)(apiDelayTime);
      runTime += new Date().getTime() - runStartTime;
      count++;
    }

    if (index < 5) {
      await (0, _utils.apiDelay)(60000 - runTime);
    }
  }

  return 'done';
}

function initData(rData) {
  const buvid = (0, _cookie.getLIVE_BUVID)(_globalVar.TaskConfig.COOKIE);
  const bilijct = (0, _cookie.getBiliJct)(_globalVar.TaskConfig.COOKIE);
  const ua = _globalVar.TaskConfig.USER_AGENT;
  rData.forEach(item => {
    item.baseData.ua = ua;
    item.baseData.csrf = item.baseData.csrf_token = bilijct;
    item.baseData.device[0] = buvid;
    item.baseData.id[2] = item.seq.v;
  });
}

function simplifyData(rData) {
  rData.forEach(item => {
    delete item.baseData.csrf;
    delete item.baseData.csrf_token;
    delete item.baseData.ua;
    item.baseData.device[0] = 0;
  });
}

async function liveHeartBySCF(argData) {
  let rData, heartNum;

  if (!argData) {
    rData = [{
      seq: {
        v: 0
      }
    }];
    heartNum = {
      v: 0
    };
  } else {
    const {
      d,
      hn
    } = JSON.parse(argData);
    rData = typeof d === 'string' ? JSON.parse((0, _utils.gzipDecode)(d)) : d || [{
      seq: {
        v: 0
      }
    }];
    heartNum = hn || {
      v: 0
    };
  }

  let count = 0;

  if (rData[0] && !rData[0].seq.v) {
    rData.length = 0;
    const {
      heartNum: hnValue,
      fansMedalList
    } = await getFansMedalList();
    heartNum.v = hnValue;

    for (const funsMedalData of fansMedalList) {
      if (heartNum.v === 0) {
        _log.logger.info(`今日获取小星星已经达到 ${HEART_MAX_NUM}`);

        return 0;
      }

      if (count >= heartNum.v) break;
      const {
        roomid,
        uname
      } = funsMedalData;
      const {
        room_id,
        area_id,
        parent_area_id
      } = await getOneRoomInfo(roomid);
      const seq = {
        v: 0
      };
      const baseData = createBaseData(room_id, area_id, parent_area_id, uname, seq.v);
      await heartBeat();
      await (0, _utils.apiDelay)(500);
      const data = await postE(baseData, seq);
      rData.push({
        data,
        baseData,
        seq
      });
      count++;
    }
  } else {
    initData(rData);

    for (const r of rData) {
      await heartBeat();
      r.data && (r.data = await postX(r.data, r.baseData, r.seq));
      await (0, _utils.apiDelay)(1000);
      count++;

      if (r.seq.v > 5) {
        r.seq.v = 0;

        if (count >= heartNum.v) {
          _log.logger.info(`今日获取小心心完成`);

          return 0;
        }
      }
    }

    if (rData.find(r => r.seq.v > 5)) {
      return 1;
    }
  }

  simplifyData(rData);
  return {
    d: (0, _utils.gzipEncode)(JSON.stringify(rData)),
    hn: heartNum,
    l: rData.length
  };
}
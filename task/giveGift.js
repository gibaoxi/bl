"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = giveGift;

var _globalVar = require("../config/globalVar");

var _live = require("../net/live.request");

var _userInfo = require("../net/user-info.request");

var _utils = require("../utils");

var _constant = require("../constant");

const EXPIRE_DATE = 2;
const {
  BILI_GIFT_UP
} = _globalVar.TaskConfig;

async function giveGift() {
  _utils.logger.info('----【投喂过期食物】----');

  try {
    const expiredGifts = await getExpiredGift();
    await (0, _utils.apiDelay)();

    if (!(expiredGifts !== null && expiredGifts !== void 0 && expiredGifts.length)) {
      _utils.logger.info(`没有${EXPIRE_DATE}天内过期的简单礼物`);

      return;
    }

    const room = await findOneRoom();

    if (!room) {
      _utils.logger.info(`没有找到投喂目标`);

      return;
    }

    await sendGift(room, expiredGifts);
  } catch (error) {
    _utils.logger.info(`投喂过期食物异常 ${error}`);
  }
}

let countGetExpiredGift = 0;

async function getExpiredGift() {
  try {
    const {
      data: {
        list
      }
    } = await (0, _live.getGiftBagList)();
    return list.filter(gift => {
      if (gift.expire_at <= 0) {
        return false;
      }

      const time = (gift.expire_at * 1000 - new Date().getTime()) / _constant.MS2DATE < EXPIRE_DATE;
      const isSimple = ![1, 30607].includes(gift.gift_id);

      if (!isSimple && time) {
        _utils.logger.info(`${gift.gift_name} 即将过期请尽快投喂`);
      }

      return !isSimple ? false : time;
    });
  } catch (error) {
    if (!countGetExpiredGift) {
      await getExpiredGift();
    } else {
      return null;
    }

    countGetExpiredGift++;
  }
}

async function findOneRoom() {
  const upList = Object.assign([], BILI_GIFT_UP);

  const getOneUp = () => upList.splice((0, _utils.random)(BILI_GIFT_UP.length - 1), 1)[0];

  while (upList.length) {
    const mid = getOneUp();
    const room = await getUserRoom(mid);

    if (room) {
      return {
        mid,
        ...room
      };
    }
  }

  return await findOneByRandomUp();
}

async function findOneByRandomUp() {
  const {
    data: {
      count,
      items: fansMedalList
    }
  } = await (0, _live.getLiveFansMedal)();
  await (0, _utils.apiDelay)();

  if (!count) {
    return;
  }

  const target = fansMedalList[(0, _utils.random)(fansMedalList.length - 1)];
  return {
    mid: target.target_id,
    roomid: target.roomid || 0,
    name: target.uname
  };
}

async function getUserRoom(mid) {
  try {
    const {
      data: {
        live_room,
        name
      }
    } = await (0, _userInfo.getUser)(mid);
    await (0, _utils.apiDelay)();

    if (live_room.roomStatus) {
      return {
        roomid: live_room.roomid,
        name
      };
    }
  } catch {}
}

async function sendGift({
  roomid,
  mid,
  name
}, gifts) {
  for (const gift of gifts) {
    await (0, _utils.apiDelay)();

    try {
      const {
        code,
        message,
        data
      } = await (0, _live.sendBagGift)({
        roomid,
        ruid: mid,
        bag_id: gift.bag_id,
        gift_id: gift.gift_id,
        gift_num: gift.gift_num
      });

      if (code !== 0) {
        _utils.logger.warn(`向[${name}]投喂[${gift.gift_name}]，${message}`);

        continue;
      }

      data.gift_list.forEach(gift => {
        _utils.logger.info(`成功给 [${name}] 投喂${gift.gift_name}`);
      });
    } catch {}
  }
}
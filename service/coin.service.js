"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coinToId = coinToId;
exports.getAidByByPriority = getAidByByPriority;
exports.getAidByCustomizeUp = getAidByCustomizeUp;
exports.getAidByFollowing = getAidByFollowing;
exports.getAidByRegionRank = getAidByRegionRank;
exports.getIdByRandom = getIdByRandom;
exports.idFuncArray = void 0;

var _utils = require("../utils");

var _userInfo = require("../net/user-info.request");

var _video = require("../net/video.request");

var _globalVar = require("../config/globalVar");

var _coin = require("../net/coin.request");

const TypeEnum = {
  video: 'video',
  audio: 'audio',
  article: 'article'
};

function getRandmonNum([video, audio, article]) {
  const total = video + audio + article;

  if (!total) {
    return;
  }

  const num = (0, _utils.random)(0, total - 1);
  let tempNum = num;

  if (num < video) {
    return {
      type: TypeEnum.video,
      page: (0, _utils.getPageNum)(30, tempNum + 1),
      index: tempNum % 30
    };
  }

  const mid = video + audio;
  tempNum = num - video;

  if (num < mid) {
    return {
      type: TypeEnum.audio,
      page: (0, _utils.getPageNum)(30, tempNum + 1),
      index: tempNum % 30
    };
  }

  tempNum = num - mid;
  return {
    type: TypeEnum.article,
    page: (0, _utils.getPageNum)(12, tempNum + 1),
    index: tempNum % 12
  };
}

async function getAidByFollowing(special = true) {
  try {
    const uid = _globalVar.TaskConfig.USERID;
    const {
      data,
      message,
      code
    } = await (special ? (0, _userInfo.getSpecialFollowings)() : (0, _userInfo.getFollowings)(uid));
    const followList = special ? data : data.list;

    if (!followList || followList.length === 0) {
      return {
        msg: '-1',
        data: {}
      };
    }

    if (code === 0) {
      await (0, _utils.apiDelay)();
      const {
        mid
      } = followList[(0, _utils.random)(followList.length - 1)] || {};
      return await getIdByRandom(mid);
    }

    return {
      msg: special ? `未获取到特别关注列表: ${code}-${message}` : `未获取到关注列表: ${code}-${message}`,
      data: {}
    };
  } catch (error) {
    return {
      msg: error.message,
      data: {}
    };
  }
}

async function getAidByRegionRank() {
  const arr = [1, 3, 4, 5, 160, 22, 119];
  const rid = arr[(0, _utils.random)(arr.length - 1)];

  try {
    const {
      data,
      message,
      code
    } = await (0, _video.getRegionRankingVideos)(rid, 3);

    if (code == 0) {
      const {
        aid,
        title,
        author
      } = data[(0, _utils.random)(data.length - 1)];
      return {
        msg: '0',
        data: {
          id: Number(aid),
          title,
          author
        }
      };
    }

    return {
      msg: `未获取到排行信息: ${code}-${message}`,
      data: {}
    };
  } catch (error) {
    return {
      msg: error.message,
      data: {}
    };
  }
}

async function getAidByCustomizeUp() {
  const customizeUp = _globalVar.TaskConfig.BILI_CUSTOMIZE_UP;

  if (customizeUp.length === 0) {
    return {
      msg: '-1',
      data: {}
    };
  }

  const mid = customizeUp[(0, _utils.random)(customizeUp.length - 1)];
  return await getIdByRandom(mid);
}

async function getIdByRandom(mid) {
  try {
    const {
      code,
      data,
      message
    } = await (0, _coin.getUserNavNum)(mid);

    if (code) {
      return {
        msg: `通过uid获取视频失败: ${code}-${message}`,
        data: {}
      };
    }

    await (0, _utils.apiDelay)();
    const {
      video,
      audio,
      article
    } = data;
    const {
      type,
      page,
      index
    } = getRandmonNum([video, audio, article]);
    const handle = {
      [TypeEnum.video]: getVideoByRandom,
      [TypeEnum.audio]: getAudioByRandom,
      [TypeEnum.article]: getArticleByRandom
    };
    const handleData = await handle[type](mid, page, index);

    if (handleData.message) {
      return {
        msg: handleData.message,
        data: {}
      };
    }

    return {
      msg: '0',
      data: handleData
    };
  } catch (error) {
    _utils.logger.debug(error);

    return {
      msg: error.message,
      data: {}
    };
  }
}

async function getVideoByRandom(mid, page, index) {
  const {
    code,
    data,
    message
  } = await (0, _coin.searchVideosByUpId)(mid, 30, page);

  if (code) {
    return {
      message
    };
  }

  const {
    aid,
    title,
    author
  } = data.list.vlist[index];
  return {
    type: TypeEnum.video,
    id: aid,
    title,
    author
  };
}

async function getAudioByRandom(mid, page, index) {
  const {
    code,
    data,
    msg
  } = await (0, _coin.searchAudiosByUpId)(mid, 30, page);

  if (code) {
    return {
      message: msg
    };
  }

  const {
    data: list
  } = data;
  const {
    id,
    uname,
    title
  } = list[index];
  return {
    type: TypeEnum.audio,
    id,
    title,
    author: uname
  };
}

async function getArticleByRandom(mid, page, index) {
  const {
    code,
    data,
    message
  } = await (0, _coin.searchArticlesByUpId)(mid, 12, page);

  if (code) {
    return {
      message
    };
  }

  const {
    articles
  } = data;
  const {
    id,
    title,
    author: {
      name
    }
  } = articles[index];
  return {
    type: TypeEnum.article,
    id,
    title,
    author: name,
    mid
  };
}

function getIdFuncArray() {
  const arr = [getAidByCustomizeUp, getAidByFollowing, () => getAidByFollowing(false), getAidByRegionRank];

  if (!_globalVar.TaskConfig.BILI_CUSTOMIZE_UP) {
    arr.shift();
  }

  return arr;
}

const idFuncArray = getIdFuncArray();
exports.idFuncArray = idFuncArray;

async function getAidByByPriority(start = 0) {
  idFuncArray.splice(0, _globalVar.TaskModule.currentStartFun + start);

  for (let index = 0; index < idFuncArray.length; index++) {
    var _TaskConfig$BILI_COIN;

    const fun = idFuncArray[index];
    let i = Number((_TaskConfig$BILI_COIN = _globalVar.TaskConfig.BILI_COIN_RETRY_NUM) !== null && _TaskConfig$BILI_COIN !== void 0 ? _TaskConfig$BILI_COIN : 4);
    i = i < 1 ? 1 : i > 8 ? 8 : i;

    while (i--) {
      await (0, _utils.apiDelay)();
      const data = await fun();
      if (data.msg === '-1') i = 0;
      if (data.msg === '0') return data;
    }

    if (i <= 0) {
      _globalVar.TaskModule.currentStartFun = index;
    }
  }

  return {
    msg: '-1',
    data: {
      id: 0
    }
  };
}

async function coinToId({
  id,
  coin = 1,
  type = 'video',
  mid
}) {
  const handle = {
    [TypeEnum.video]: _coin.addCoinForVideo,
    [TypeEnum.audio]: _coin.addCoinForAudio,
    [TypeEnum.article]: (id, coin = 1) => (0, _coin.addCoinForArticle)(mid, id, coin)
  };
  const handleData = await handle[type](Number(id), coin);
  return {
    code: handleData.code,
    message: handleData.message || handleData.msg
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matchGame;

var _globalVar = require("../config/globalVar");

var _matchGame = require("../net/match-game.request");

var _utils = require("../utils");

var _log = require("../utils/log");

const {
  MATCH_SELECTION,
  MATCH_COINS
} = _globalVar.TaskConfig;

async function matchGame() {
  _log.logger.info('----【赛事硬币竞猜】----');

  if (MATCH_COINS <= 0) {
    _log.logger.info('硬币数量不能小于 0');

    return;
  }

  if (isLackOfCoin()) {
    return;
  }

  const list = await getOneGuessCollection();
  await (0, _utils.apiDelay)();

  if (!list) {
    return;
  }

  const count = await guessOne(filterList(list, _globalVar.TaskConfig.MATCH_DIFF));

  _log.logger.info(`【竞猜结束】一共参与${count}次预测`);
}

function filterList(list, n) {
  return list.filter(item => {
    const {
      questions
    } = item;
    const [{
      details,
      is_guess
    }] = questions;

    if (is_guess) {
      return false;
    }

    const [team1, team2] = details;
    const diff = Math.abs(team1.odds - team2.odds);
    return diff >= n;
  });
}

async function getOneGuessCollection() {
  try {
    const {
      code,
      message,
      data: {
        list,
        page
      }
    } = await (0, _matchGame.getGuessCollection)();

    if (code !== 0) {
      _log.logger.warn(`获取赛事错误 ${code} ${message}`);

      return;
    }

    if (page.total === 0) {
      _log.logger.info('今日已经无法获取赛事');

      return null;
    }

    return list;
  } catch (error) {}
}

async function guessOne(list) {
  let count = 0;

  try {
    for (const games of list) {
      const {
        contest,
        questions
      } = games;
      const contestId = contest.id;
      const [{
        id: questionsId,
        title,
        details,
        is_guess
      }] = questions;
      const [team1, team2] = details;

      if (isLackOfCoin()) {
        return count;
      }

      if (is_guess) {
        continue;
      }

      _log.logger.info(`${title} <=> ${team1.odds}:${team2.odds}`);

      const oddResult = team1.odds > team2.odds;
      let teamSelect;

      if (MATCH_SELECTION > 0) {
        teamSelect = oddResult ? team2 : team1;
      } else {
        teamSelect = oddResult ? team1 : team2;
      }

      _log.logger.info(`预测[ ${teamSelect.option} ] ${MATCH_COINS} 颗硬币`);

      await (0, _utils.apiDelay)();
      const {
        code
      } = await (0, _matchGame.guessAdd)(contestId, questionsId, teamSelect.detail_id, MATCH_COINS);

      if (code !== 0) {
        _log.logger.info('预测失败');
      } else {
        count++;
        _globalVar.TaskModule.money -= MATCH_COINS;
      }
    }
  } catch (error) {
    console.warn(error.message);
  }

  return count;
}

function isLackOfCoin() {
  if (_globalVar.TaskModule.money - MATCH_COINS < _globalVar.TaskConfig.BILI_TARGET_COINS) {
    _log.logger.info(`需要保留${_globalVar.TaskConfig.BILI_TARGET_COINS}个硬币，任务结束`);

    return true;
  }

  return false;
}
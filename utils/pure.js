"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUUID = createUUID;
exports.getMonthHasDays = getMonthHasDays;
exports.getPRCDate = getPRCDate;
exports.getPageNum = getPageNum;
exports.jsonp2Object = jsonp2Object;
exports.random = random;
exports.randomDailyRunTime = randomDailyRunTime;
exports.setCron = setCron;

var _constant = require("../constant");

const MAX_MINUTES = 59,
      MAX_HOURS = 23,
      DAILY_MIN_HOURS = 19;

function getMonthHasDays(now) {
  const nowTime = now || getPRCDate(),
        year = nowTime.getFullYear(),
        month = nowTime.getMonth() + 1,
        smallMonth = [4, 6, 9, 11];
  const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;

  if (month === 2) {
    return isLeapYear ? 29 : 28;
  } else if (smallMonth.includes(month)) {
    return 30;
  } else {
    return 31;
  }
}

function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, t => {
    const e = 16 * Math.random() | 0;
    return (t === 'x' ? e : 3 & e | 8).toString(16);
  });
}

function getPRCDate() {
  const now = new Date(),
        nowTime = now.getTime(),
        timezone = now.getTimezoneOffset() / 60;
  return new Date(nowTime + (timezone + 8) * _constant.MS2HOUR);
}

function jsonp2Object(jsonp) {
  const jsonpData = jsonp.replace(/^\w+\(/, '').replace(/\)$/, '');
  return JSON.parse(jsonpData);
}

function getPageNum(n, m) {
  return Math.ceil(m / n);
}

function setCron(time = 60000) {
  time = time || 60000;
  const pre = getPRCDate().getTime() + time;
  const next = new Date(pre);
  const s = next.getSeconds(),
        m = next.getMinutes(),
        h = next.getHours();
  return {
    value: `${s} ${m} ${h} * * * *`,
    string: `${h}:${m}:${s}`
  };
}

function random(lower, upper, floating) {
  if (floating && typeof floating !== 'boolean') {
    upper = floating = undefined;
  }

  if (floating === undefined) {
    if (typeof upper === 'boolean') {
      floating = upper;
      upper = undefined;
    } else if (typeof lower === 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }

  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  } else if (upper === undefined) {
    upper = lower;
    lower = 0;
  }

  if (lower > upper) {
    const temp = lower;
    lower = upper;
    upper = temp;
  }

  if (floating || lower % 1 || upper % 1) {
    const rand = Math.random();
    return Math.min(lower + rand * (upper - lower + parseFloat('1e-' + ((rand + '').length - 1))), upper);
  }

  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function randomDailyRunTime(dailyRunTime = _constant.DAILY_RUN_TIME, len6) {
  var _startTime$, _endTime$;

  const taskTime = dailyRunTime.split('-');
  const startTime = taskTime[0].split(':').map(str => +str);
  const endTime = taskTime[1].split(':').map(str => +str);
  const hours = random((_startTime$ = startTime[0]) !== null && _startTime$ !== void 0 ? _startTime$ : DAILY_MIN_HOURS, (_endTime$ = endTime[0]) !== null && _endTime$ !== void 0 ? _endTime$ : MAX_HOURS);
  let minutes = 0;

  if (hours == startTime[0]) {
    minutes = random(startTime[1], MAX_MINUTES);
  } else if (hours == endTime[0]) {
    minutes = random(endTime[1]);
  } else {
    minutes = random(MAX_MINUTES);
  }

  let seconds = 0;

  if (hours == startTime[0]) {
    seconds = random(startTime[2], MAX_MINUTES);
  } else if (hours == endTime[0]) {
    seconds = random(endTime[2]);
  } else {
    seconds = random(MAX_MINUTES);
  }

  const suffix = len6 ? '' : ' *';
  return {
    value: `${seconds} ${minutes} ${hours} * * *` + suffix,
    string: `${hours}:${minutes}:${seconds}`
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.getBiliJct = getBiliJct;
exports.getCookieItem = getCookieItem;
exports.getLIVE_BUVID = getLIVE_BUVID;
exports.getUserId = getUserId;

function getCookieArray(cookie) {
  if (!cookie) return [];
  return cookie.split('; ').map(el => el.split('='));
}

function cookie2Obj(cookie, setCookie) {
  const setCookieArr = getCookieArray(setCookie === null || setCookie === void 0 ? void 0 : setCookie[0]).filter(el => el.length === 2);
  const arr = getCookieArray(cookie).concat(setCookieArr).filter(el => el.length === 2);
  const obj = {};

  for (const it of arr) {
    if (obj[it[0]]) {
      obj[it[0]] = it[1];
    } else {
      Object.defineProperty(obj, it[0], {
        value: it[1],
        enumerable: true,
        writable: true
      });
    }
  }

  return obj;
}

function getCookieString(obj) {
  const string = Object.keys(obj).reduce((pre, cur) => {
    return pre + `${cur}=${obj[cur]}; `;
  }, '');
  return string.substring(0, string.length - 2 || 0);
}

function _default(cookie, setCookie) {
  if (!cookie) return '';
  if (!setCookie || setCookie.length === 0) return cookie;
  return getCookieString(cookie2Obj(cookie, setCookie));
}

function getCookieItem(cookie, key) {
  if (!cookie) return null;
  const reg = `(?:^|)${key}=([^;]*)(?:;|$)`;
  const r = cookie.match(reg);
  return r ? r[1] : null;
}

function getUserId(cookie) {
  return Number(getCookieItem(cookie, 'DedeUserID')) || 0;
}

function getBiliJct(cookie) {
  return getCookieItem(cookie, 'bili_jct') || '';
}

function getLIVE_BUVID(cookie) {
  return getCookieItem(cookie, 'LIVE_BUVID') || '';
}
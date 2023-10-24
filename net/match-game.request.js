"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuessCollection = getGuessCollection;
exports.guessAdd = guessAdd;

var _qs = require("qs");

var _api = require("./api");

var _globalVar = require("../config/globalVar");

const csrf = _globalVar.TaskConfig.BILIJCT;
const csrf_token = csrf;

async function getGuessCollection(stime = '', etime = '') {
  const {
    data
  } = await _api.biliApi.get(`/x/esports/guess/collection/question?pn=1&ps=50&gid=&sids=&stime=${stime}&etime=${etime}`);
  return data;
}

async function guessAdd(oid, main_id, detail_id, count) {
  const postData = (0, _qs.stringify)({
    is_fav: 0,
    main_id,
    oid,
    detail_id,
    count,
    csrf,
    csrf_token
  });
  const {
    data
  } = await _api.biliApi.post('/x/esports/guess/add', postData);
  return data;
}
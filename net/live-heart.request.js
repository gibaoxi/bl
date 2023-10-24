"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heartBeat = heartBeat;
exports.postE = postE;
exports.postX = postX;

var _qs = require("qs");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function postE(postData) {
  const {
    data
  } = await _.default.post('https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/E', (0, _qs.stringify)(postData));
  return data;
}

async function postX(postData) {
  const {
    data
  } = await _.default.post('https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/X', (0, _qs.stringify)(postData));
  return data;
}

async function heartBeat() {
  const {
    data
  } = await _.default.get('https://api.live.bilibili.com/relation/v1/Feed/heartBeat');
  return data;
}
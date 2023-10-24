"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clockIn = clockIn;

var _qs = require("qs");

var _api = require("./api");

async function clockIn(platform = 'android') {
  const {
    data
  } = await _api.mangaApi.post('/twirp/activity.v1.Activity/ClockIn', (0, _qs.stringify)({
    platform
  }));
  return data;
}
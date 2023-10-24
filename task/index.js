"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "liveHeart", {
  enumerable: true,
  get: function () {
    return _liveHeart.default;
  }
});
Object.defineProperty(exports, "loginTask", {
  enumerable: true,
  get: function () {
    return _loginTask.default;
  }
});

var _liveSignTask = _interopRequireDefault(require("./liveSignTask"));

var _loginTask = _interopRequireDefault(require("./loginTask"));

var _taskReward = _interopRequireDefault(require("./taskReward"));

var _shareAndWatch = _interopRequireDefault(require("./shareAndWatch"));

var _addCoins = _interopRequireDefault(require("./addCoins"));

var _mangaTask = _interopRequireDefault(require("./mangaTask"));

var _silver2Coin = _interopRequireDefault(require("./silver2Coin"));

var _supGroupSign = _interopRequireDefault(require("./supGroupSign"));

var _sendLiveMsg = _interopRequireDefault(require("./sendLiveMsg"));

var _charging = _interopRequireDefault(require("./charging"));

var _getVipPrivilege = _interopRequireDefault(require("./getVipPrivilege"));

var _giveGift = _interopRequireDefault(require("./giveGift"));

var _matchGame = _interopRequireDefault(require("./matchGame"));

var _liveHeart = _interopRequireDefault(require("./liveHeart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  taskReward: _taskReward.default,
  liveSignTask: _liveSignTask.default,
  shareAndWatch: _shareAndWatch.default,
  silver2Coin: _silver2Coin.default,
  addCoins: _addCoins.default,
  mangaSign: _mangaTask.default,
  supGroupSign: _supGroupSign.default,
  liveSendMessage: _sendLiveMsg.default,
  charging: _charging.default,
  getVipPrivilege: _getVipPrivilege.default,
  giveGift: _giveGift.default,
  matchGame: _matchGame.default
};
exports.default = _default;
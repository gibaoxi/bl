"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "axios", {
  enumerable: true,
  get: function () {
    return _axios.default;
  }
});
exports.defaultHeaders = exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _globalVar = require("../config/globalVar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const USER_AGENT = _globalVar.TaskConfig.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62';
const defaultHeaders = {
  'User-Agent': USER_AGENT,
  'content-type': 'application/x-www-form-urlencoded',
  'accept-language': 'accept-language: zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7'
};
exports.defaultHeaders = defaultHeaders;
_axios.default.defaults.headers.common['Cookie'] = _globalVar.TaskConfig.COOKIE;
_axios.default.defaults.withCredentials = true;
_axios.default.defaults.headers.common['User-Agent'] = defaultHeaders['User-Agent'];
_axios.default.defaults.headers.post['content-type'] = defaultHeaders['content-type'];
_axios.default.defaults.headers.common['accept-language'] = defaultHeaders['accept-language'];
var _default = _axios.default;
exports.default = _default;
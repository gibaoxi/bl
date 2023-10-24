"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountApi = void 0;
Object.defineProperty(exports, "axios", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
exports.vcApi = exports.mangaApi = exports.liveApi = exports.biliApi = void 0;

var _index = _interopRequireDefault(require("./index"));

var _globalVar = require("../config/globalVar");

var _cookie = _interopRequireDefault(require("../utils/cookie"));

var _ErrorCode = require("../config/ErrorCode");

var _effect = require("../utils/effect");

var _log = require("../utils/log");

var _biliUri = require("../constant/biliUri");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const res = res => {
  var _res$headers, _res$data;

  const setCookie = ((_res$headers = res.headers) === null || _res$headers === void 0 ? void 0 : _res$headers['set-cookie']) || [];
  _globalVar.TaskConfig.COOKIE = (0, _cookie.default)(_globalVar.TaskConfig.COOKIE, setCookie);
  const code = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.code;

  const exit = async () => {
    _log.logger.error(`运行结束：${_ErrorCode.ErrorCodeCommon[code]}`);

    await (0, _effect.sendMessage)(`异常：${_ErrorCode.ErrorCodeCommon[code]}`, _log.LogMessage.value);
    process.exit(0);
  };

  switch (code) {
    case _ErrorCode.ErrorCodeCommon['账号未登录']:
    case _ErrorCode.ErrorCodeCommon['账号被封停']:
      exit();
      break;

    default:
      return res;
  }
};

const err = err => {
  return axiosRetryInterceptor(err);
};

function axiosRetryInterceptor(err) {
  const config = err.config;
  if (config.retry === 0) return Promise.reject(err);
  if (!config.retry) config.retry = 2;
  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }

  config.__retryCount += 1;
  const backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve(void 0);
    }, config.retryDelay || 100);
  });
  return backoff.then(function () {
    return (0, _index.default)(config);
  });
}

_index.default.interceptors.response.use(res, err);

const accountApi = _index.default.create({
  baseURL: _biliUri.baseURLs.account
});

exports.accountApi = accountApi;

const liveApi = _index.default.create({
  baseURL: _biliUri.baseURLs.live,
  headers: {
    Referer: _biliUri.RefererURLs.www
  }
});

exports.liveApi = liveApi;

const biliApi = _index.default.create({
  baseURL: _biliUri.baseURLs.api,
  headers: {
    Referer: _biliUri.RefererURLs.www
  }
});

exports.biliApi = biliApi;

const mangaApi = _index.default.create({
  baseURL: _biliUri.baseURLs.manga
});

exports.mangaApi = mangaApi;

const vcApi = _index.default.create({
  baseURL: _biliUri.baseURLs.vc
});

exports.vcApi = vcApi;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkConfig = checkConfig;
exports.getConfig = getConfig;

var path = _interopRequireWildcard(require("path"));

var _log = require("../utils/log");

var _gzip = require("../utils/gzip");

var _systemConfig = require("./systemConfig");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const resolveCWD = str => path.resolve(process.cwd(), str);

function errorHandle(msg) {
  throw new Error(msg || '配置文件不存（位置不正确）在或 cookie 不存在！！！');
}

const configArr = [() => require(resolveCWD('./config/config.dev.json')), () => require(`./${_systemConfig.SystemConfig.configFileName}`), () => require(resolveCWD(`./config/${_systemConfig.SystemConfig.configFileName}`))];
const qlOldConfigArr = [() => require('./config.json'), () => require(resolveCWD('./config/config.json'))];

const getEnvConfig = () => {
  const {
    BILITOOLS_CONFIG,
    BILI_SCF_CONFIG,
    BILI_CONFIG
  } = process.env;
  const config = BILITOOLS_CONFIG || BILI_SCF_CONFIG || BILI_CONFIG;

  if (!config) {
    return undefined;
  }

  try {
    return JSON.parse((0, _gzip.gzipDecode)(config));
  } catch {
    errorHandle('环境中的配置不是有效的 JSON 字符串！');
  }
};

function handleQLPanel(configArr) {
  const arg2 = process.argv.find(arg => arg.includes('--item') || arg.includes('-i') || arg.includes('-I'));

  if (!arg2) {
    return configArr[0];
  }

  const index = Number(arg2.split('=')[1]) - 1;

  if (!index || index >= configArr.length || index < 0) {
    _log.logger.warn('似乎想要指定一个不存在的用户，我们将指定第一个用户');

    return configArr[0];
  }

  return configArr[index];
}

function handleMultiUserConfig(config) {
  const newConfig = config.account.filter(conf => conf.cookie);

  if (newConfig.length === 0) {
    return undefined;
  }

  if (_systemConfig.SystemConfig.isQingLongPanel) {
    return handleQLPanel(newConfig);
  }

  _log.logger.warn('在单用户场景下配置了多用户，我们将放弃多余的配置');

  const conf = newConfig[0];
  conf.message = Object.assign(config.message || {}, conf.message);
  return conf;
}

function setConfig() {
  if (_systemConfig.SystemConfig.isQingLongPanel) {
    configArr.splice(0, 1, ...qlOldConfigArr);
  }

  for (const fn of configArr) {
    try {
      const config = fn();

      if (config) {
        return config;
      }

      errorHandle('配置文件存在，但是无法解析！可能 JSON 格式不正确！');
    } catch (error) {
      const {
        message = {}
      } = error;

      if (message.includes && message.includes('in JSON at position')) {
        errorHandle('配置文件存在，但是无法解析！可能 JSON 格式不正确！');
      }

      continue;
    }
  }

  return getEnvConfig();
}

function getConfig() {
  return checkConfig(setConfig());
}

function checkConfig(config) {
  if (!config) {
    errorHandle();
  }

  if (config.account && config.account.length) {
    const multiUserConfig = handleMultiUserConfig(config);

    if (multiUserConfig) {
      return multiUserConfig;
    }
  }

  if (!config.cookie) {
    errorHandle();
  }

  return config;
}
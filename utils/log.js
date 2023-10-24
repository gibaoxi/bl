"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.LogMessage = void 0;

var _pure = require("./pure");

const LogMessage = {
  value: ''
};
exports.LogMessage = LogMessage;
const logger = {
  log,
  error: errorLogger,
  warn: warnLogger,
  info: infoLogger,
  verbose: verboseLogger,
  debug: debugLogger
};
exports.logger = logger;

function formatTime(isoStr) {
  return isoStr.match(/\w{2}:\w{2}:\w{2}/)[0];
}

function getLevelValues(level = 'debug') {
  const LEVEL_VALUE = ['error', 'warn', 'info', 'verbose', 'debug'];
  const levelIndex = LEVEL_VALUE.indexOf(level);
  return levelIndex > 0 ? LEVEL_VALUE.slice(0, levelIndex + 1) : LEVEL_VALUE;
}

function log(level, message) {
  const time = formatTime((0, _pure.getPRCDate)().toString());

  if (getLevelValues().includes(level)) {
    const msgStr = `[${time}] ${message}`;
    LogMessage.value += msgStr + '\n';
  }

  console.log('[%s %s] %s', level, time, message);
}

function errorLogger(message) {
  log('error', message);
}

function warnLogger(message) {
  log('warn', message);
}

function infoLogger(message) {
  log('info', message);
}

function verboseLogger(message) {
  log('verbose', message);
}

function debugLogger(message) {
  log('debug', message);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kaomoji = exports.defaultComments = exports.MS2HOUR = exports.MS2DATE = exports.HEART_TRIGGER_NAME = exports.HEART_RUN_TIME = exports.DAILY_RUN_TIME = void 0;
const defaultComments = ['棒', '棒唉', '棒耶', '加油~', 'UP加油!', '支持~', '支持支持！', '催更啦', '顶顶', '留下脚印~', '干杯', 'bilibili干杯', 'o(*￣▽￣*)o', '(｡･∀･)ﾉﾞ嗨', '(●ˇ∀ˇ●)', '( •̀ ω •́ )y', '(ง •_•)ง', '>.<', '^_~'];
exports.defaultComments = defaultComments;
const kaomoji = ['(⌒▽⌒)', '（￣▽￣）', '(=・ω・=)', '(｀・ω・´)', '(〜￣△￣)〜', '(･∀･)', '(°∀°)ﾉ', '(￣3￣)', '╮(￣▽￣)╭', '_(:3」∠)_', '( ´_ゝ｀)', '←_←', '→_→', '(<_<)', '(>_>)', '(;¬_¬)', '(ﾟДﾟ≡ﾟдﾟ)!?', 'Σ(ﾟдﾟ;)', 'Σ( ￣□￣||)', '(´；ω；`)', '（/TДT)/', '(^・ω・^ )', '(｡･ω･｡)', '(●￣(ｴ)￣●)', 'ε=ε=(ノ≧∇≦)ノ', '(´･_･`)', '(-_-#)', '（￣へ￣）', '(￣ε(#￣) Σ', 'ヽ(`Д´)ﾉ', '（#-_-)┯━┯', '(╯°口°)╯(┴—┴', '←◡←', '( ♥д♥)', 'Σ>―(〃°ω°〃)♡→', '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '(╬ﾟдﾟ)▄︻┻┳═一', '･*･:≡(　ε:)', '(汗)', '(苦笑)'];
exports.kaomoji = kaomoji;
const HEART_TRIGGER_NAME = 'heart_bili_timer';
exports.HEART_TRIGGER_NAME = HEART_TRIGGER_NAME;
const DAILY_RUN_TIME = '17:30:00-23:40:00';
exports.DAILY_RUN_TIME = DAILY_RUN_TIME;
const HEART_RUN_TIME = '12:00:00-20:00:00';
exports.HEART_RUN_TIME = HEART_RUN_TIME;
const MS2DATE = 86400000;
exports.MS2DATE = MS2DATE;
const MS2HOUR = 3600000;
exports.MS2HOUR = MS2HOUR;
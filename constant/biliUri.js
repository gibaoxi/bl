"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseURLs = exports.RefererURLs = exports.OriginURLs = void 0;
const OriginURLs = {
  account: 'https://account.bilibili.com',
  live: 'https://live.bilibili.com'
};
exports.OriginURLs = OriginURLs;
const RefererURLs = {
  www: 'https://www.bilibili.com/'
};
exports.RefererURLs = RefererURLs;
const baseURLs = {
  account: 'https://account.bilibili.com',
  live: 'https://api.live.bilibili.com',
  api: 'https://api.bilibili.com',
  manga: 'https://manga.bilibili.com',
  vc: 'https://api.vc.bilibili.com'
};
exports.baseURLs = baseURLs;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gzip = require("./gzip");

Object.keys(_gzip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _gzip[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gzip[key];
    }
  });
});

var _effect = require("./effect");

Object.keys(_effect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _effect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _effect[key];
    }
  });
});

var _cookie = require("./cookie");

Object.keys(_cookie).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _cookie[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cookie[key];
    }
  });
});

var _env = require("./env");

Object.keys(_env).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _env[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _env[key];
    }
  });
});

var _log = require("./log");

Object.keys(_log).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log[key];
    }
  });
});

var _pure = require("./pure");

Object.keys(_pure).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _pure[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pure[key];
    }
  });
});
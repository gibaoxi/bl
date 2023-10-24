"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gzipEncode = exports.gzipDecode = exports.default = void 0;

var pako = _interopRequireWildcard(require("pako"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const gzipEncode = str => {
  try {
    return Buffer.from(pako.gzip(escape(str), {
      to: 'string'
    }).toString(), 'binary').toString('base64');
  } catch (e) {
    return 'Error: 当前字符串不能被Gzip加密';
  }
};

exports.gzipEncode = gzipEncode;

const gzipDecode = str => {
  try {
    const charData = Buffer.from(str, 'base64').toString('binary').split('').map(x => x.charCodeAt(0));
    const data = pako.inflate(new Uint8Array(charData));
    const result = String.fromCharCode.apply(null, new Uint16Array(data));

    try {
      return unescape(result);
    } catch (ee) {
      return result;
    }
  } catch (e) {
    throw new Error('Error: 当前字符串不能被Gzip解密');
  }
};

exports.gzipDecode = gzipDecode;
var _default = {
  gzipDecode,
  gzipEncode
};
exports.default = _default;
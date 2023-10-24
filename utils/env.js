"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isQingLongPanel = void 0;
exports.setConfigFileName = setConfigFileName;

const isQingLongPanel = () => {
  return process.env.BARK_GROUP === 'QingLong' || process.env.QL_DIR === '/ql';
};

exports.isQingLongPanel = isQingLongPanel;

function setConfigFileName() {
  const defaultConfigFileName = isQingLongPanel() ? 'cat_bili_config' : 'config',
        ext = '.json';
  const {
    BILITOOLS_FILE_NAME
  } = process.env;

  if (BILITOOLS_FILE_NAME) {
    if (BILITOOLS_FILE_NAME.endsWith(ext)) {
      return BILITOOLS_FILE_NAME;
    }

    return `${BILITOOLS_FILE_NAME}${ext}`;
  }

  return defaultConfigFileName + ext;
}
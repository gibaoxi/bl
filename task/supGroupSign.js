"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = supGroupSign;

var _utils = require("../utils");

var _supGroup = require("../net/sup-group.request");

var _log = require("../utils/log");

async function getMyGroups() {
  try {
    const {
      data,
      code,
      message
    } = await (0, _supGroup.getMyGroupsApi)();

    if (code === 0) {
      return (data === null || data === void 0 ? void 0 : data.list) || [];
    }

    _log.logger.warn(`获取自己的应援团异常失败: ${message}`);

    return [];
  } catch (error) {
    _log.logger.error(`获取自己的应援团异常: ${error}`);
  }
}

async function supGroupSign() {
  _log.logger.info('----【应援团签到】----');

  const myGroups = await getMyGroups();
  await (0, _utils.apiDelay)();
  let count = 0;

  for (let i = 0; i < myGroups.length;) {
    const group = myGroups[i];

    try {
      const {
        data,
        code,
        message
      } = await (0, _supGroup.groupSignApi)(group.group_id, group.owner_uid);

      if (code === 0) {
        if (data.status === 0) {
          count++;
        } else {
          _log.logger.info(message);
        }
      } else {
        _log.logger.warn(`[${group.group_name}]签到失败 ${message}`);
      }
    } catch (error) {
      _log.logger.error(`签到异常 ${error.message}`);
    } finally {
      await (0, _utils.apiDelay)();
    }
  }

  _log.logger.info(`签到结束，成功${count}/${myGroups.length}`);
}
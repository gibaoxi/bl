"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fc = _interopRequireDefault(require("@alicloud/fc2"));

var _pure = require("./pure");

var _globalVar = require("../config/globalVar");

var _log = require("./log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function _default(event, context, customArg, triggerDesc, runningTotalNumber = 2) {
  if (!event.triggerName) {
    return false;
  }

  if (!process.env.ALI_SECRET_ID || !process.env.ALI_SECRET_KEY) {
    _log.logger.info('环境变量不存在ALI_SECRET_ID和ALI_SECRET_KEY');

    return false;
  }

  const FUNCTION_NAME = context.function.name;
  const TRIGGER_NAME = event.triggerName;
  const SERVICE_NAME = context.service.name;
  const client = new _fc.default(context.accountId, {
    accessKeyID: process.env.ALI_SECRET_ID,
    accessKeySecret: process.env.ALI_SECRET_KEY,
    region: context.region
  });

  async function updateTrigger(cron) {
    const today = (0, _pure.getPRCDate)();
    const cronExpression = `CRON_TZ=Asia/Shanghai ${cron}`;

    try {
      return await client.updateTrigger(SERVICE_NAME, FUNCTION_NAME, TRIGGER_NAME, {
        triggerConfig: {
          cronExpression,
          payload: JSON.stringify({ ...customArg,
            lastTime: today.getDate().toString()
          })
        }
      });
    } catch (error) {
      _log.logger.error(`更新trigger失败 ${error.message}`);

      return false;
    }
  }

  async function aSingleUpdate() {
    const runTime = triggerDesc || (0, _pure.randomDailyRunTime)(_globalVar.TaskConfig.config.dailyRunTime, true);

    _log.logger.info(`修改时间为：${runTime.string}`);

    return !!(await updateTrigger(runTime.value));
  }

  let updateResults = false;

  while (!updateResults && runningTotalNumber) {
    updateResults = await aSingleUpdate();
    runningTotalNumber--;
  }

  return updateResults;
}
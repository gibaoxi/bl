"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _tencentcloudSdkNodejs = require("tencentcloud-sdk-nodejs");

var _pure = require("./pure");

var _globalVar = require("../config/globalVar");

var _log = require("./log");

const ScfClient = _tencentcloudSdkNodejs.scf.v20180416.Client;

async function _default(event, context, customArg, triggerDesc, runningTotalNumber = 2) {
  if (!event.TriggerName) {
    return false;
  }

  if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
    _log.logger.info('环境变量不存在TENCENT_SECRET_ID和TENCENT_SECRET_KEY');

    return false;
  }

  const FUNCTION_NAME = context.function_name;
  const TRIGGER_NAME = event.TriggerName;
  const clientConfig = {
    credential: {
      secretId: process.env.TENCENT_SECRET_ID,
      secretKey: process.env.TENCENT_SECRET_KEY
    },
    region: context.tencentcloud_region,
    profile: {
      httpProfile: {
        endpoint: 'scf.tencentcloudapi.com'
      }
    }
  };
  const client = new ScfClient(clientConfig);

  async function createTrigger(params) {
    const today = (0, _pure.getPRCDate)();
    params.CustomArgument = JSON.stringify({ ...customArg,
      lastTime: today.getDate().toString()
    });

    try {
      return await client.CreateTrigger(params);
    } catch ({
      code,
      message
    }) {
      _log.logger.error(`创建trigger失败 ${code} => ${message}`);

      return false;
    }
  }

  async function deleteTrigger(params) {
    try {
      return await client.DeleteTrigger(params);
    } catch ({
      code,
      message
    }) {
      _log.logger.warn(`删除trigger失败 ${code} => ${message}`);

      return false;
    }
  }

  async function getHasTrigger() {
    try {
      const {
        Triggers
      } = await client.ListTriggers({
        FunctionName: FUNCTION_NAME
      });
      const triggerIndex = Triggers === null || Triggers === void 0 ? void 0 : Triggers.findIndex(trigger => trigger.TriggerName === TRIGGER_NAME);
      return triggerIndex !== -1;
    } catch ({
      code,
      message
    }) {
      _log.logger.error(`获取trigger失败 ${code} => ${message}`);

      return false;
    }
  }

  async function aSingleUpdate() {
    const runTime = triggerDesc || (0, _pure.randomDailyRunTime)(_globalVar.TaskConfig.config.dailyRunTime);
    const params = {
      FunctionName: FUNCTION_NAME,
      TriggerName: TRIGGER_NAME,
      Type: 'timer',
      TriggerDesc: runTime.value,
      Qualifier: '$DEFAULT'
    };
    const hasTrigger = await getHasTrigger();

    _log.logger.info(`修改时间为：${runTime.string}`);

    if (hasTrigger) {
      const deleteResult = await deleteTrigger(params);

      if (!deleteResult) {
        return;
      }
    }

    return !!(await createTrigger(params));
  }

  let updateResults = false;

  while (!updateResults && runningTotalNumber) {
    updateResults = await aSingleUpdate();
    runningTotalNumber--;
  }

  return updateResults;
}
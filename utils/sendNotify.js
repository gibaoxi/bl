"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BARK_PUSH = void 0;
exports.sendNotify = sendNotify;

var querystring = _interopRequireWildcard(require("querystring"));

var nodemailer = _interopRequireWildcard(require("nodemailer"));

var got = _interopRequireWildcard(require("got"));

var cktough = _interopRequireWildcard(require("tough-cookie"));

var tunnel = _interopRequireWildcard(require("tunnel"));

var _globalVar = require("../config/globalVar");

var _log = require("./log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(function () {
  var _TaskConfig$config;

  function upperCaseToHump(str) {
    return str.toLowerCase().replace(/_(\w)/g, (_match, t) => t.toUpperCase());
  }

  const envName = ['GOBOT_URL', 'GOBOT_TOKEN', 'GOBOT_QQ', 'SCKEY', 'QQ_SKEY', 'QQ_MODE', 'BARK_PUSH', 'BARK_SOUND', 'BARK_GROUP', 'TG_BOT_TOKEN', 'TG_USER_ID', 'TG_PROXY_AUTH', 'TG_PROXY_HOST', 'TG_PROXY_PORT', 'TG_API_HOST', 'DD_BOT_TOKEN', 'DD_BOT_SECRET', 'QYWX_KEY', 'QYWX_AM', 'IGOT_PUSH_KEY', 'PUSH_PLUS_TOKEN', 'PUSH_PLUS_USER'];
  const message = ((_TaskConfig$config = _globalVar.TaskConfig.config) === null || _TaskConfig$config === void 0 ? void 0 : _TaskConfig$config.message) || {};

  if (_globalVar.TaskConfig.PUSHPLUS_TOKEN) {
    process.env.PUSH_PLUS_TOKEN = _globalVar.TaskConfig.PUSHPLUS_TOKEN;
  }

  envName.forEach(name => {
    const value = message[upperCaseToHump(name)] || message[name] || process.env[name];

    if (value) {
      process.env[name] = value;
    }
  });
})();

const $ = new Env();
const timeout = 15000;
let SCKEY = '';
let BARK_PUSH = '';
exports.BARK_PUSH = BARK_PUSH;
let BARK_SOUND = '';
let BARK_GROUP = 'QingLong';
let TG_BOT_TOKEN = '';
let TG_USER_ID = '';
let TG_PROXY_HOST = '';
let TG_PROXY_PORT = '';
let TG_PROXY_AUTH = '';
let TG_API_HOST = 'api.telegram.org';
let DD_BOT_TOKEN = '';
let DD_BOT_SECRET = '';
let QYWX_KEY = '';
let QYWX_AM = '';
let IGOT_PUSH_KEY = '';
let PUSH_PLUS_TOKEN = '';
let PUSH_PLUS_USER = '';

if (process.env.PUSH_KEY) {
  SCKEY = process.env.PUSH_KEY;
}

if (process.env.QQ_SKEY) {
  var QQ_SKEY = process.env.QQ_SKEY;
}

if (process.env.QQ_MODE) {
  var QQ_MODE = process.env.QQ_MODE;
}

if (process.env.BARK_PUSH) {
  if (process.env.BARK_PUSH.indexOf('https') > -1 || process.env.BARK_PUSH.indexOf('http') > -1) {
    exports.BARK_PUSH = BARK_PUSH = process.env.BARK_PUSH;
  } else {
    exports.BARK_PUSH = BARK_PUSH = `https://api.day.app/${process.env.BARK_PUSH}`;
  }

  if (process.env.BARK_SOUND) {
    BARK_SOUND = process.env.BARK_SOUND;
  }

  if (process.env.BARK_GROUP) {
    BARK_GROUP = process.env.BARK_GROUP;
  }
} else {
  if (BARK_PUSH && BARK_PUSH.indexOf('https') === -1 && BARK_PUSH.indexOf('http') === -1) {
    exports.BARK_PUSH = BARK_PUSH = `https://api.day.app/${BARK_PUSH}`;
  }
}

if (process.env.TG_BOT_TOKEN) {
  TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
}

if (process.env.TG_USER_ID) {
  TG_USER_ID = process.env.TG_USER_ID;
}

if (process.env.TG_PROXY_AUTH) TG_PROXY_AUTH = process.env.TG_PROXY_AUTH;
if (process.env.TG_PROXY_HOST) TG_PROXY_HOST = process.env.TG_PROXY_HOST;
if (process.env.TG_PROXY_PORT) TG_PROXY_PORT = process.env.TG_PROXY_PORT;
if (process.env.TG_API_HOST) TG_API_HOST = process.env.TG_API_HOST;

if (process.env.DD_BOT_TOKEN) {
  DD_BOT_TOKEN = process.env.DD_BOT_TOKEN;

  if (process.env.DD_BOT_SECRET) {
    DD_BOT_SECRET = process.env.DD_BOT_SECRET;
  }
}

if (process.env.QYWX_KEY) {
  QYWX_KEY = process.env.QYWX_KEY;
}

if (process.env.QYWX_AM) {
  QYWX_AM = process.env.QYWX_AM;
}

if (process.env.IGOT_PUSH_KEY) {
  IGOT_PUSH_KEY = process.env.IGOT_PUSH_KEY;
}

if (process.env.PUSH_PLUS_TOKEN) {
  PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;
}

if (process.env.PUSH_PLUS_USER) {
  PUSH_PLUS_USER = process.env.PUSH_PLUS_USER;
}

async function sendNotify(text, desp, params = {}, author = '\n\n本通知 By：https://github.com/catlair/BiliTools') {
  desp += author;
  await Promise.all([serverNotify(text, desp), pushPlusNotify(text, desp)]);
  await Promise.all([BarkNotify(text, desp, params), tgBotNotify(text, desp), ddBotNotify(text, desp), qywxBotNotify(text, desp), qywxamNotify(text, desp), iGotNotify(text, desp, params), sendMail(text, desp), customApi(text, desp)]);
}

async function sendMail(title, text) {
  var _TaskConfig$config$me;

  const user = (_TaskConfig$config$me = _globalVar.TaskConfig.config.message) === null || _TaskConfig$config$me === void 0 ? void 0 : _TaskConfig$config$me.email;
  if (!user || !user.pass || !user.from || !user.host) return;
  const port = Number(user.port) || 465;
  const transporter = nodemailer.createTransport({
    host: user.host,
    port: port,
    secure: port === 465,
    auth: {
      user: user.from,
      pass: user.pass
    }
  });
  const info = await transporter.sendMail({
    from: `${title} <${user.from}>`,
    to: user.to,
    subject: title,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    },
    text: text.replace(/\n/g, '\r\n')
  });

  _log.logger.info(`邮件消息已发送: ${info.messageId}`);
}

async function customApi(title, text) {
  try {
    const apiTemplate = _globalVar.TaskConfig.MESSAGE_API;
    if (!apiTemplate) return;
    const api = apiTemplate.replace('{title}', title).replace('{text}', text);
    await $.get(api);
  } catch (error) {}
}

function serverNotify(text, desp, time = 2100) {
  return new Promise(resolve => {
    if (SCKEY) {
      desp = desp.replace(/[\n\r]/g, '\n\n');
      const options = {
        url: SCKEY.includes('SCT') ? `https://sctapi.ftqq.com/${SCKEY}.send` : `https://sc.ftqq.com/${SCKEY}.send`,
        body: `text=${text}&desp=${desp}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout
      };
      setTimeout(() => {
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              _log.logger.info('发送通知调用API失败！！\n');

              _log.logger.info(err);
            } else {
              data = JSON.parse(data);

              if (data.errno === 0 || data.data.errno === 0) {
                _log.logger.info('server酱发送通知消息成功🎉\n');
              } else if (data.errno === 1024) {
                _log.logger.info(`server酱发送通知消息异常: ${data.errmsg}\n`);
              } else {
                _log.logger.info(`server酱发送通知消息异常\n${JSON.stringify(data)}`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        });
      }, time);
    } else {
      resolve('');
    }
  });
}

function CoolPush(text, desp) {
  return new Promise(resolve => {
    if (QQ_SKEY) {
      const options = {
        url: `https://push.xuthus.cc/${QQ_MODE}/${QQ_SKEY}`,
        headers: {
          'Content-Type': 'application/json'
        },
        json: {},
        body: {}
      };
      text = text.replace(/京豆/g, '豆豆');
      desp = desp.replace(/京豆/g, '');
      desp = desp.replace(/🐶/g, '');
      desp = desp.replace(/红包/g, 'H包');

      switch (QQ_MODE) {
        case 'email':
          options.json = {
            t: text,
            c: desp
          };
          break;

        default:
          options.body = `${text}\n\n${desp}`;
      }

      const pushMode = function (t) {
        switch (t) {
          case 'send':
            return '个人';

          case 'group':
            return 'QQ群';

          case 'wx':
            return '微信';

          case 'ww':
            return '企业微信';

          case 'email':
            return '邮件';

          default:
            return '未知方式';
        }
      };

      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info(`发送${pushMode(QQ_MODE)}通知调用API失败！！\n`);

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.code === 200) {
              _log.logger.info(`酷推发送${pushMode(QQ_MODE)}通知消息成功🎉\n`);
            } else if (data.code === 400) {
              _log.logger.info(`QQ酷推(Cool Push)发送${pushMode(QQ_MODE)}推送失败：${data.msg}\n`);
            } else if (data.code === 503) {
              _log.logger.info(`QQ酷推出错，${data.message}：${data.data}\n`);
            } else {
              _log.logger.info(`酷推推送异常: ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function BarkNotify(text, desp, params = {}) {
  return new Promise(resolve => {
    if (BARK_PUSH) {
      const options = {
        url: `${BARK_PUSH}/${encodeURIComponent(text)}/${encodeURIComponent(desp)}?sound=${BARK_SOUND}&group=${BARK_GROUP}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout
      };
      $.get(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('Bark APP发送通知调用API失败！！\n');

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.code === 200) {
              _log.logger.info('Bark APP发送通知消息成功🎉\n');
            } else {
              _log.logger.info(`${data.message}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve('');
        }
      });
    } else {
      resolve('');
    }
  });
}

function tgBotNotify(text, desp) {
  return new Promise(resolve => {
    if (TG_BOT_TOKEN && TG_USER_ID) {
      const options = {
        url: `https://${TG_API_HOST}/bot${TG_BOT_TOKEN}/sendMessage`,
        body: `chat_id=${TG_USER_ID}&text=${text}\n\n${desp}&disable_web_page_preview=true`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout
      };

      if (TG_PROXY_HOST && TG_PROXY_PORT) {
        const agent = {
          https: tunnel.httpsOverHttp({
            proxy: {
              host: TG_PROXY_HOST,
              port: +TG_PROXY_PORT,
              proxyAuth: TG_PROXY_AUTH
            }
          })
        };
        Object.assign(options, {
          agent
        });
      }

      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('telegram发送通知消息失败！！\n');

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.ok) {
              _log.logger.info('Telegram发送通知消息成功🎉。\n');
            } else if (data.error_code === 400) {
              _log.logger.info('请主动给bot发送一条消息并检查接收用户ID是否正确。\n');
            } else if (data.error_code === 401) {
              _log.logger.info('Telegram bot token 填写错误。\n');
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function ddBotNotify(text, desp) {
  return new Promise(resolve => {
    const options = {
      url: `https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`,
      json: {
        msgtype: 'text',
        text: {
          content: ` ${text}\n\n${desp}`
        }
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout
    };

    if (DD_BOT_TOKEN && DD_BOT_SECRET) {
      const crypto = require('crypto');

      const dateNow = Date.now();
      const hmac = crypto.createHmac('sha256', DD_BOT_SECRET);
      hmac.update(`${dateNow}\n${DD_BOT_SECRET}`);
      const result = encodeURIComponent(hmac.digest('base64'));
      options.url = `${options.url}&timestamp=${dateNow}&sign=${result}`;
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('钉钉发送通知消息失败！！\n');

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.errcode === 0) {
              _log.logger.info('钉钉发送通知消息成功🎉。\n');
            } else {
              _log.logger.info(`${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else if (DD_BOT_TOKEN) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('钉钉发送通知消息失败！！\n');

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.errcode === 0) {
              _log.logger.info('钉钉发送通知消息完成。\n');
            } else {
              _log.logger.info(`${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function qywxBotNotify(text, desp) {
  return new Promise(resolve => {
    const options = {
      url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${QYWX_KEY}`,
      json: {
        msgtype: 'text',
        text: {
          content: ` ${text}\n\n${desp}`
        }
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout
    };

    if (QYWX_KEY) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('企业微信发送通知消息失败！！\n');

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.errcode === 0) {
              _log.logger.info('企业微信发送通知消息成功🎉。\n');
            } else {
              _log.logger.info(`${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function ChangeUserId(desp) {
  const QYWX_AM_AY = QYWX_AM.split(',');

  if (QYWX_AM_AY[2]) {
    const userIdTmp = QYWX_AM_AY[2].split('|');
    let userId = '';

    for (let i = 0; i < userIdTmp.length; i++) {
      const count = '账号' + (i + 1);
      const count2 = '签到号 ' + (i + 1);

      if (desp.match(count2)) {
        userId = userIdTmp[i];
      }
    }

    if (!userId) userId = QYWX_AM_AY[2];
    return userId;
  } else {
    return '@all';
  }
}

function qywxamNotify(text, desp) {
  return new Promise(resolve => {
    if (QYWX_AM) {
      const QYWX_AM_AY = QYWX_AM.split(',');
      const options_accesstoken = {
        url: `https://qyapi.weixin.qq.com/cgi-bin/gettoken`,
        json: {
          corpid: `${QYWX_AM_AY[0]}`,
          corpsecret: `${QYWX_AM_AY[1]}`
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout
      };
      $.post(options_accesstoken, (err, resp, data) => {
        const html = desp.replace(/\n/g, '<br/>');
        const json = JSON.parse(data);
        const accesstoken = json.access_token;
        let options;

        switch (QYWX_AM_AY[4]) {
          case '0':
            options = {
              msgtype: 'textcard',
              textcard: {
                title: `${text}`,
                description: `${desp}`,
                url: 'https://github.com/whyour/qinglong',
                btntxt: '更多'
              }
            };
            break;

          case '1':
            options = {
              msgtype: 'text',
              text: {
                content: `${text}\n\n${desp}`
              }
            };
            break;

          default:
            options = {
              msgtype: 'mpnews',
              mpnews: {
                articles: [{
                  title: `${text}`,
                  thumb_media_id: `${QYWX_AM_AY[4]}`,
                  author: `智能助手`,
                  content_source_url: ``,
                  content: `${html}`,
                  digest: `${desp}`
                }]
              }
            };
        }

        if (!QYWX_AM_AY[4]) {
          options = {
            msgtype: 'text',
            text: {
              content: `${text}\n\n${desp}`
            }
          };
        }

        options = {
          url: `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accesstoken}`,
          json: {
            touser: `${ChangeUserId(desp)}`,
            agentid: `${QYWX_AM_AY[3]}`,
            safe: '0',
            ...options
          },
          headers: {
            'Content-Type': 'application/json'
          }
        };
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              _log.logger.info('成员ID:' + ChangeUserId(desp) + '企业微信应用消息发送通知消息失败！！\n');

              _log.logger.info(err);
            } else {
              data = JSON.parse(data);

              if (data.errcode === 0) {
                _log.logger.info('成员ID:' + ChangeUserId(desp) + '企业微信应用消息发送通知消息成功🎉。\n');
              } else {
                _log.logger.info(`${data.errmsg}\n`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        });
      });
    } else {
      resolve('');
    }
  });
}

function iGotNotify(text, desp, params = {}) {
  return new Promise(resolve => {
    if (IGOT_PUSH_KEY) {
      const IGOT_PUSH_KEY_REGX = new RegExp('^[a-zA-Z0-9]{24}$');

      if (!IGOT_PUSH_KEY_REGX.test(IGOT_PUSH_KEY)) {
        _log.logger.info('您所提供的IGOT_PUSH_KEY无效\n');

        resolve('');
        return;
      }

      const options = {
        url: `https://push.hellyw.com/${IGOT_PUSH_KEY.toLowerCase()}`,
        body: `title=${text}&content=${desp}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info('发送通知调用API失败！！\n');

            _log.logger.info(err);
          } else {
            if (typeof data === 'string') data = JSON.parse(data);

            if (data.ret === 0) {
              _log.logger.info('iGot发送通知消息成功🎉\n');
            } else {
              _log.logger.info(`iGot发送通知消息失败：${data.errMsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function pushPlusNotify(text, desp) {
  return new Promise(resolve => {
    if (PUSH_PLUS_TOKEN) {
      desp = desp.replace(/[\n\r]/g, '<br>');
      const body = {
        token: `${PUSH_PLUS_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        topic: `${PUSH_PLUS_USER}`
      };
      const options = {
        url: `https://www.pushplus.plus/send`,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': ' application/json'
        },
        timeout
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            _log.logger.info(`push+发送${PUSH_PLUS_USER ? '一对多' : '一对一'}通知消息失败！！\n`);

            _log.logger.info(err);
          } else {
            data = JSON.parse(data);

            if (data.code === 200) {
              _log.logger.info(`push+发送${PUSH_PLUS_USER ? '一对多' : '一对一'}通知消息完成。\n`);
            } else {
              _log.logger.info(`push+发送${PUSH_PLUS_USER ? '一对多' : '一对一'}通知消息失败：${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve('');
    }
  });
}

function Env(t, s) {
  return new class {
    constructor(t, s) {
      this.name = t, this.data = null, this.dataFile = "box.dat", this.logs = [], this.logSeparator = "\n", this.startTime = new Date().getTime(), Object.assign(this, s), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }

    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }

    isQuanX() {
      return "undefined" != typeof $task;
    }

    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }

    isLoon() {
      return "undefined" != typeof $loon;
    }

    getScript(t) {
      return new Promise(s => {
        $.get({
          url: t
        }, (t, e, i) => s(i));
      });
    }

    runScript(t, s) {
      return new Promise(e => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        o = o ? 1 * o : 20, o = s && s.timeout ? s.timeout : o;
        const [h, a] = i.split("@"),
              r = {
          url: `http://${a}/v1/scripting/evaluate`,
          body: {
            script_text: t,
            mock_type: "cron",
            timeout: o
          },
          headers: {
            "X-Key": h,
            Accept: "*/*"
          }
        };
        $.post(r, (t, s, i) => e(i));
      }).catch(t => this.logErr(t));
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
              s = this.path.resolve(process.cwd(), this.dataFile),
              e = this.fs.existsSync(t),
              i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;

          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
              s = this.path.resolve(process.cwd(), this.dataFile),
              e = this.fs.existsSync(t),
              i = !e && this.fs.existsSync(s),
              o = JSON.stringify(this.data);
        e ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(s, o) : this.fs.writeFileSync(t, o);
      }
    }

    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let o = t;

      for (const t of i) if (o = Object(o)[t], void 0 === o) return e;

      return o;
    }

    lodash_set(t, s, e) {
      return Object(t) !== t ? t : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []), s.slice(0, -1).reduce((t, e, i) => Object(t[e]) === t[e] ? t[e] : t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}, t)[s[s.length - 1]] = e, t);
    }

    getdata(t) {
      let s = this.getval(t);

      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
              o = e ? this.getval(e) : "";
        if (o) try {
          const t = JSON.parse(o);
          s = t ? this.lodash_get(t, i, "") : s;
        } catch (t) {
          s = "";
        }
      }

      return s;
    }

    setdata(t, s) {
      let e = !1;

      if (/^@/.test(s)) {
        const [, i, o] = /^@(.*?)\.(.*?)$/.exec(s),
              h = this.getval(i),
              a = i ? "null" === h ? null : h || "{}" : "{}";

        try {
          const s = JSON.parse(a);
          this.lodash_set(s, o, t), e = this.setval(JSON.stringify(s), i);
        } catch (s) {
          const h = {};
          this.lodash_set(h, o, t), e = this.setval(JSON.stringify(h), i);
        }
      } else e = $.setval(t, s);

      return e;
    }

    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
    }

    setval(t, s) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, s) : this.isQuanX() ? $prefs.setValueForKey(t, s) : this.isNode() ? (this.data = this.loaddata(), this.data[s] = t, this.writedata(), !0) : this.data && this.data[s] || null;
    }

    initGotEnv(t) {
      this.got = this.got ? this.got : got, this.cktough = this.cktough ? this.cktough : cktough, this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar(), t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }

    get(t, s = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? $httpClient.get(t, (t, e, i) => {
        !t && e && (e.body = i, e.statusCode = e.status), s(t, e, i);
      }) : this.isQuanX() ? $task.fetch(t).then(t => {
        const {
          statusCode: e,
          statusCode: i,
          headers: o,
          body: h
        } = t;
        s(null, {
          status: e,
          statusCode: i,
          headers: o,
          body: h
        }, h);
      }, t => s(t)) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, s) => {
        try {
          const e = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
          this.ckjar.setCookieSync(e, null), s.cookieJar = this.ckjar;
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const {
          statusCode: e,
          statusCode: i,
          headers: o,
          body: h
        } = t;
        s(null, {
          status: e,
          statusCode: i,
          headers: o,
          body: h
        }, h);
      }, t => s(t)));
    }

    post(t, s = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) $httpClient.post(t, (t, e, i) => {
        !t && e && (e.body = i, e.statusCode = e.status), s(t, e, i);
      });else if (this.isQuanX()) t.method = "POST", $task.fetch(t).then(t => {
        const {
          statusCode: e,
          statusCode: i,
          headers: o,
          body: h
        } = t;
        s(null, {
          status: e,
          statusCode: i,
          headers: o,
          body: h
        }, h);
      }, t => s(t));else if (this.isNode()) {
        this.initGotEnv(t);
        const {
          url: e,
          ...i
        } = t;
        this.got.post(e, i).then(t => {
          const {
            statusCode: e,
            statusCode: i,
            headers: o,
            body: h
          } = t;
          s(null, {
            status: e,
            statusCode: i,
            headers: o,
            body: h
          }, h);
        }, t => s(t));
      }
    }

    time(t) {
      const s = {
        "M+": new Date().getMonth() + 1,
        "d+": new Date().getDate(),
        "H+": new Date().getHours(),
        "m+": new Date().getMinutes(),
        "s+": new Date().getSeconds(),
        "q+": Math.floor((new Date().getMonth() + 3) / 3),
        S: new Date().getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)));

      for (const e in s) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? s[e] : ("00" + s[e]).substr(("" + s[e]).length)));

      return t;
    }

    msg(s = t, e = "", i = "", o) {
      const h = t => !t || !this.isLoon() && this.isSurge() ? t : "string" == typeof t ? this.isLoon() ? t : this.isQuanX() ? {
        "open-url": t
      } : void 0 : "object" == typeof t && (t["open-url"] || t["media-url"]) ? this.isLoon() ? t["open-url"] : this.isQuanX() ? t : void 0 : void 0;

      $.isMute || (this.isSurge() || this.isLoon() ? $notification.post(s, e, i, h(o)) : this.isQuanX() && $notify(s, e, i, h(o))), this.logs.push("", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="), this.logs.push(s), e && this.logs.push(e), i && this.logs.push(i);
    }

    log(...t) {
      t.length > 0 ? this.logs = [...this.logs, ...t] : _log.logger.info(this.logs.join(this.logSeparator));
    }

    logErr(t, s) {
      const e = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      e ? $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
    }

    wait(t) {
      return new Promise(s => setTimeout(s, t));
    }

    done(t = {}) {
      const s = new Date().getTime(),
            e = (s - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }

  }(t, s);
}
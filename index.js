"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _globalVar = require("./config/globalVar");

_globalVar.TaskConfig.config = 

 
  {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
    cookie: 'buvid3=02365AF8-E93C-BDE7-3B66-661398D2503E43288infoc; b_nut=1670380343; i-wanna-go-back=-1; _uuid=C7DD16ED-C3610-AB102-81D4-715E10B3CC3F143826infoc; fingerprint=0c960e5634c109d9f32ab358359b8463; buvid_fp_plain=undefined; DedeUserID=84108578; DedeUserID__ckMd5=dacb442fcc522973; buvid_fp=0c960e5634c109d9f32ab358359b8463;b_ut=5; nostalgia_conf=-1; buvid4=275AB695-CA97-E91A-8CEC-1A7B907C6F5C46474-022120710-sIBy2zwjhrW%2Bc%2FmxWsMjzQ%3D%3D; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; header_theme_version=CLOSE; go_old_video=1; CURRENT_PID=d858a150-d5fe-11ed-9fc3-19a583f1c582; LIVE_BUVID=AUTO8716812188919182; CURRENT_QUALITY=0; FEED_LIVE_VERSION=V8; home_feed_column=4; PVID=1; bp_video_offset_84108578=819280254567710800; innersign=0; b_lsid=2F759E92_189DE10DDCC; SESSDATA=4fb53651%2C1707199799%2C655e4%2A82yXGFHlfH5VsxcE0fr_OvTT77EmYGOg8fwE2xegS9eXmOVr8qdj92Qec5iIjYjk8Nkl1SgQAATgA; bili_jct=caec960a4c7d69b0c77d7aba3e3e60ae; browser_resolution=1060-1307; sid=f18xmmcg; bili_ticket=eyJhbGciOiJFUzM4NCIsImtpZCI6ImVjMDIiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2OTE5MDcwMjYsImlhdCI6MTY5MTY0NzgyNiwicGx0IjotMX0.BFdgiOJWBRtVHye5r1Hh4P00shz56oJa_9cQ1lFe0fV9SJFDQ7KDWuNX3L8Cr8JVh4pJZJd9K9xmiMFCrQ0OwqOu6_Z4Qr_GDbcZqU-d336bp277BLMjwPshjMgqbVuK; bili_ticket_expires=1691907026',
    function: {
    liveSignTask: true,giveGift: true,mangaSign: true,   addCoins:true,
    
  },
 message: {
pushplusToken:'c204e4622c9f4e3e8bf06591c7f6e89d', 

     },
    };


  

var _dailyTask = require("./task/dailyTask");

function handler(_event, _context, callback) {
  (0, _dailyTask.dailyTasks)().then(message => {
    callback(null, message);
  }).catch(err => {
    callback(err);
  });
}

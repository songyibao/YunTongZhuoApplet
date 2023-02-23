const app = getApp()
const config = require('../cos_config')
var CosAuth = require('../lib/cos-auth')
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var date = {};
  date.day = [year, month, day].map(formatNumber).join('-');
  date.time = [hour, minute].map(formatNumber).join(':');
  return date;
}
var timeTrans = function (in_time) {
  let now_time = formatDate(new Date())
//   console.log(in_time)
//   console.log(now_time)
  if (in_time !== null) {
      if (in_time.indexOf(now_time.day.substring(0, 4)) != -1) {
          //今年
          if (in_time.indexOf(now_time.day) != -1) {
              //今天
              if (in_time.indexOf(now_time.time.substring(0, 3)) != -1) {
                  //同小时
                  if (Number(now_time.time.substring(3)) - Number(in_time.substring(14, 16)) === 0) {
                      return '刚刚'
                  } else {
                      return (Number(now_time.time.substring(3)) - Number(in_time.substring(14, 16))).toString() + '分钟前'
                  }
              } else if ((60 - Number(in_time.substring(14, 16)) + Number(now_time.time.substring(3)) < 60) && (Number(now_time.time.substring(0, 2)) - Number(in_time.substring(11, 13)) === 1)) {
                  //不同小时，但没超过一小时
                  return (60 - Number(in_time.substring(14, 16)) + Number(now_time.time.substring(3))).toString() + '分钟前'
              } else {
                  //超过一小时，取小时数的近似值
                  let hour = Math.floor((60 - Number(in_time.substring(14, 16)) + Number(now_time.time.substring(3))) / 60) + Number(now_time.time.substring(0, 2)) - Number(in_time.substring(11, 13)) - 1
                  return hour.toString() + '小时前'
              }
              // return '今天' + in_time.substring(in_time.indexOf(' '), in_time.indexOf(' ') + 6)
          } else if ((Number(now_time.day.substring(8)) - Number(in_time.substring(8, 10)) === 1) && (now_time.day.substring(5, 7) === in_time.substring(5, 7))) {
              return '昨天' + in_time.substring(11, 16)
          } else {
              return in_time.substring(5, 16)
          }
      } else {
          return in_time.substring(0, 16)
      }
  }
}
var uploadFile = function (headPath, filePath,callback) {
    // 请求用到的参数
    // var prefix = 'https://cos.' + config.Region + '.myqcloud.com/' + config.Bucket + '/'; // 这个是后缀式，签名也要指定 Pathname: '/' + config.Bucket + '/'
    var prefix = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/';

    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = function (callback) {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expiredTime) {
            callback(stsCache.credentials);
            return;
        }
        wx.request({
            method: 'GET',
            url: config.stsUrl, // 服务端签名，参考 server 目录下的两个签名例子
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                var credentials = data.credentials;
                if (credentials) {
                    stsCache = data
                } else {
                    wx.showModal({
                        title: '临时密钥获取失败',
                        content: JSON.stringify(data),
                        showCancel: false
                    });
                }
                callback(stsCache && stsCache.credentials);
            },
            error: function (err) {
                wx.showModal({
                    title: '临时密钥获取失败',
                    content: JSON.stringify(err),
                    showCancel: false
                });
            }
        });
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.sessionToken,
                Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname,
                })
            });
        });
    };

    // 上传文件
    var Key = headPath + filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
    getAuthorization({
        Method: 'POST',
        Pathname: '/'
    }, function (AuthData) {
        var requestTask = wx.uploadFile({
            url: prefix,
            name: 'file',
            filePath: filePath,
            formData: {
                'key': Key,
                'success_action_status': 200,
                'Signature': AuthData.Authorization,
                'x-cos-security-token': AuthData.XCosSecurityToken,
                'Content-Type': '',
            },
            success: function (res) {
                var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                // if (res.statusCode === 200) {
                //   wx.showModal({title: '上传成功', content: url, showCancel: false});
                // } else {
                //   wx.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                // }
                console.log('upLoadSuccess')
                console.log(res.statusCode);
                console.log(url);
                callback && callback()
            },
            fail: function (res) {
                wx.showModal({
                    title: '上传失败',
                    content: JSON.stringify(res),
                    showCancel: false
                });
            }
        });
        requestTask.onProgressUpdate(function (res) {
            console.log('正在进度:', res);
        });
    });

}
var timeFormatterWithDays = function(value) {
    var day = Math.floor(value / 3600 / 24)
    var hour = Math.floor(value/3600)%24
    var minute = Math.floor(value/60)%60
    var sec = value%60
    var res = (day==0?'':(day+'天'))+(hour==0?'':(hour+'时'))+(minute==0?'':(minute+'分'))+(sec==0?'':(sec+'秒'))
    return res!=''?res:'无'
}
module.exports={
  timeTrans:timeTrans,
  uploadFile:uploadFile,
  timeFormatterWithDays:timeFormatterWithDays
}
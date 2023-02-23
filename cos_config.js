const apiUrl = require('./config.js').server_url
module.exports = {
    // stsUrl: 'https://api.songyb.xyz/cos_api/sts.php',
    // Bucket: 'wechatapp-1303225742',
    // Region: 'ap-nanjing',
    stsUrl: apiUrl+'/Cos/sts',
    Bucket: 'yuntongzhuo-1304998734',
    Region: 'ap-shanghai',
};
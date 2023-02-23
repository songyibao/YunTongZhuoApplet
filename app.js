// app.js
// {
//   "pagePath": "pages/tabbar/community/community",
//   "text": "云上校园",
//   "iconPath": "/images/tabbar/community.jpg",
//   "selectedIconPath": "/images/tabbar/community.jpg"
// },
const server_url=require('./config.js').server_url
const appid=require('./config.js').appid
App({
  globalData: {
    uid:0,
    userInfo: null,
    openid:''
  },
  onLaunch() {
    var self=this
    wx.setNavigationBarTitle({
      title: '掌上云同桌',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          // url: server_url+'/WechatApi/onLogin/code/'+res.code+'/appid/'+appid,
          url: server_url+"/WechatApi/onLogin/code/"+res.code+'/appid/'+appid,
          success: res=>{
            self.globalData.openid=res.data.data
          }
        })
      }
    })
    self.globalData.userInfo=wx.getStorageSync('userInfo')
    // wx.loadFontFace({
    //   global:'true',
    //   family: 'siyuanhei',
    //   source: 'url("'+server_url+'/Download/font/name/siyuanhei")',
    //   success(res){
    //     console.log('res', res)
    //   },
    //   fail(err){
    //     console.log('err', err)
    //   }
    // })
    // wx.loadFontFace({
    //   global:'true',
    //   family: 'zhehei',
    //   source: 'url("'+server_url+'/Download/font/name/zhehei")',
    //   success(res){
    //     console.log('res', res)
    //   },
    //   fail(err){
    //     console.log('err', err)
    //   }
    // })
  }
})

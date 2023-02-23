// index.js
// 获取应用实例
const server_url = require('../../config').server_url
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.setNavigationBarColor({
      backgroundColor: '#172943',
      frontColor: '#ffffff',
    })
  },
  onShow:function(){
    setTimeout(
      function(){
        if(app.globalData.userInfo!=""){
          // setTimeout(
          //   function(){
          //     wx.showTabBar({
          //       animation: true,
          //     })
          //   },2500
          // )
          wx.request({
            url: server_url+'/User/login',
            method:'POST',
            data:{
              openid:app.globalData.openid,
              nickName:app.globalData.userInfo.nickName,
              avatarUrl:app.globalData.userInfo.avatarUrl
            },
            success:res=>{
              console.log('index.js',res.data)
              if(res.data.code==0){
                app.globalData.uid=res.data.data.id
                app.globalData.userInfo=res.data.data
              }else{
                wx.showToast({
                  title: '连接服务器失败',
                  icon:'error'
                })
              }
            }
          })
          wx.switchTab({
            url: '/pages/tabbar/deskmate/deskmate',
          })
        }else{
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }

      },2000
    )
  }
})

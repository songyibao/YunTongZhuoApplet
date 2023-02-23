const { server_url } = require("../../config")

var app=getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    wx.setNavigationBarColor({
      backgroundColor: '#ABD6E1',
      frontColor: '#ffffff',
    })
  },
  bindGetUserInfo:function (e) {
    console.log('test')
    wx.getUserProfile({
      desc: '展示您的头像、昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo)
        app.globalData.userInfo=res.userInfo
        wx.request({
          url: server_url+'/User/login',
          method:'POST',
          data:{
            openid:app.globalData.openid,
            nickName:app.globalData.userInfo.nickName,
            avatarUrl:app.globalData.userInfo.avatarUrl
          },
          success:res=>{
            console.log('login.js',res.data)
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
      }
    })
  },
  cancel:function(){
    wx.switchTab({
      url: '/pages/tabbar/deskmate/deskmate',
    })
  }
})
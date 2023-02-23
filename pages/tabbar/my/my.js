// pages/tabbar/my/my.js
const server_url = require('./../../../config').server_url
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
  },
  logout:function(){
    wx.showModal({
      cancelColor: '#000000',
      confirmColor:'#ff0000',
      title:'确认登出？',
      success:res=>{
        if(res.confirm){
          wx.clearStorageSync()
          app.globalData.uid=0
          app.globalData.userInfo=null
          app.globalData.openid=''
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  toStudy:function(){
    wx.switchTab({
      url: '/pages/tabbar/study/study',
    })
  },
  toReward:function(){
    wx.showToast({
      icon:'none',
      title: '暂未开放',
    })
  },
  changeinfo:function(){
    console.log('change')
    var self=this
    if(this.data.userInfo==""){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      // wx.navigateTo({
      //   url: '/pages/tabbar/my/changeinfo/changeinfo',
      // })
      wx.showModal({
        title:'同桌寄语',
        content:self.data.userInfo.signature || "",
        cancelColor: '#000000',
        confirmColor:'#000000',
        editable:true,
        success:res=>{
          if(res.confirm){
            console.log('confirm')
            // return
            wx.request({
              url: server_url+'/User/change_info/uid/'+app.globalData.uid,
              method:'POST',
              data: {
                  uid:app.globalData.id,
                  // tel: this.data.tel,
                  // signature: res.content,
                  signature:res.content
              },
              success: res => {
                  console.log('change_res', res.data)
                  if(res.data.code==0){
                      app.globalData.userInfo = res.data.data
                      self.setData({
                        userInfo:res.data.data
                      })
                      wx.showToast({
                          title: '修改成功',
                          icon:'success',
                          duration:1000
                        })
                  }else{
                      wx.showToast({
                          title: '修改失败',
                          icon:'error',
                          duration:1000
                        })
                  }
              },
              fail: res => {
              },
          })
          }
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人信息',
    })
    // wx.setNavigationBarColor({
    //   backgroundColor: '#ffffff',
    //   frontColor: '#87C5D3',
    // })
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setTabBarStyle({
      backgroundColor: '#ffffff',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/tabbar/deskmate/look/look.js
const server_url = require('../../../../config').server_url
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    can:true
  },
  get_apls: function () {
    var self = this
    wx.request({
      url: server_url + '/Deskmate/get_apls/uid/' + app.globalData.uid,
      success: res => {
        console.log(res.data)
        self.setData({
          users: res.data.data
        })
      }
    })
  },
  accept:function(res){
    if(!this.data.can){
      wx.showToast({
        title: '您已有同桌',
        icon:'error'
      })
      return
    }
    var self=this
    console.log('accept',res)
    wx.request({
      url: server_url+'/Deskmate/accept/id/'+app.globalData.uid+'/from/'+res.currentTarget.dataset.id,
      success:res=>{
        if(res.data.code==0){
          self.setData({
            can:false
          })
          app.globalData.userInfo=res.data.data
          wx.navigateBack()
        }
      }
    })
    this.get_apls();
  },
  reject:function(res){
    console.log('reject',res)
    wx.request({
      url: server_url+'/Deskmate/reject/id/'+app.globalData.uid+'/from/'+res.currentTarget.dataset.id,
    })
    this.get_apls();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我收到的申请',
    })
    this.get_apls()

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
    var self=this
    wx.request({
      url: server_url+'/User/login',
      method:'POST',
      data:{
        openid:app.globalData.openid,
        nickName:app.globalData.userInfo.nickName,
        avatarUrl:app.globalData.userInfo.avatarUrl
      },
      success:res=>{
        if(res.data.code==0){
          app.globalData.uid=res.data.data.id
          app.globalData.userInfo=res.data.data
          self.setData({
            can:app.globalData.userInfo.have_d==0?true:false
          })
        }else{
          wx.showToast({
            title: '连接服务器失败',
            icon:'error'
          })
        }
      }
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
// pages/tabbar/deskmate/deskmate.js
const server_url=require('../../../config.js').server_url
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    users:[],
    deskmate:null,
    avatarUrl:""
  },
  to_look:function(){
    wx.navigateTo({
      url: '/pages/tabbar/deskmate/look/look'
    })
  },
  to_search:function(){
    wx.navigateTo({
      url: '/pages/tabbar/deskmate/search/search'
    })
  },
  to_daka:function(){
    wx.navigateTo({
      url: '/pages/tabbar/deskmate/mydeskmate/mydeskmate',
    })
  },
  get_deskmate:function(){
    var self=this
    wx.request({
      url: server_url+'/Deskmate/get_dinfo/uid/'+app.globalData.uid,
      success:res=>{
        console.log(res.data)
        self.setData({
          deskmate:res.data.data
        })
      }
    })
    if(self.data.deskmate!==null){
      app.globalData.userInfo.have_d=1
    }
  },
  get_apls:function(){
    var self=this
    wx.request({
      url: server_url+'/Deskmate/get_apls/uid/'+app.globalData.uid,
      success:res=>{
        console.log(res.data)
        self.setData({
          users:res.data.data
        })
      }
    })
  },
  clearInvalidStudy(){
    wx.request({
      url: server_url+'/Study/clear',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this
    wx.setNavigationBarTitle({
      title: '我的同桌',
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
    this.clearInvalidStudy()
    wx.setTabBarStyle({
      backgroundColor: '#ffffff',
    })
    this.setData({
      avatarUrl:app.globalData.userInfo.avatarUrl!==undefined?app.globalData.userInfo.avatarUrl:'/images/my/default.png'
    })
    var self=this
    var time
    time=setInterval(function() {
      if(app.globalData.uid!==0){
        self.get_apls()
        self.get_deskmate()
        clearInterval(time)
      }
    },200);

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
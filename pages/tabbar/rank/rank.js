// pages/tabbar/deskmate/search/search.js
const server_url = require('../../../config').server_url
var app = getApp()
var timeTrans = require('../../../utils/util').timeFormatterWithDays
Page({

  /**
   * 页面的初始数据
   */
  data: {
    av_users: [],
    show: false,
    comment: '',
    selectedId: 0,
    have_d:0
  },
  commentChange: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  hide: function () {
    this.setData({
      show: false
    })
  },
  is_login: function (e) {
    if (app.globalData.uid == 0) {
      wx.showModal({
        title: '提示',
        content: '授权登陆后即可体验，是否立即登录?',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    } else {
      this.setData({
        selectedId: e.currentTarget.dataset.id
      })
      this.show()
    }
  },
  show: function (e) {
    var self = this
    if (app.globalData.userInfo.have_d && app.globalData.userInfo.have_d !== 0) {
      wx.showToast({
        title: '您已有同桌',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showModal({
      cancelColor: '#000000',
      confirmColor: '#000000',
      confirmText: '申请',
      editable: true,
      placeholderText:'填写申请备注',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (res.content == '') {
            wx.showToast({
              title: '备注不能为空',
              icon: 'none'
            })
            return
          }else{
            self.apply(res.content)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  apply: function (e) {
    var self = this
    console.log(e)
    wx.request({
      url: server_url + '/Deskmate/apply',
      method: 'POST',
      data: {
        id: self.data.selectedId,
        from: app.globalData.uid,
        comment: e
      },
      success: res => {
        console.log(res.data)
        if(res.data.code==0){
          wx.showToast({
            title: '申请成功!',
          })
        }else{
          wx.showToast({
            title: '不能重复申请',
            icon:'error'
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.request({
      url: server_url + '/Deskmate/get_total_time',
      success: res => {
        var arr = []
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        // res.data.data.push({'totalTime':0})
        res.data.data = res.data.data.sort((a,b)=>{
          return b['totalTime']-a['totalTime']
        })
        res.data.data.forEach(function (item, index) {
          item.totalTime = timeTrans(item.totalTime)
          arr.push(item)
        })
        self.setData({
          av_users: arr
        })
      }
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
      backgroundColor: '#c8e8f0',
    })
      this.onLoad()
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
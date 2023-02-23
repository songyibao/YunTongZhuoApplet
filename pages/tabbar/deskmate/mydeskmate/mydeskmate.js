// pages/tabbar/deskmate/mydeskmate/mydeskmate.js
const server_url = require('../../../../config.js').server_url
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: null,
    flag: '',
    placeholder: '',
    show: false,
    plan: '',
    tell: '',
    show: false,
    deskmate: {},
    week: [1, 2, 3, 4, 5, 6, 7],
    plan: '',
    timer: "00:00",
    isRunning: false,
    color: 'black',
    study_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  dataChange: function (e) {
    if (this.data.flag == 'plan') {
      this.data.plan = e.detail.value
    } else if (this.data.flag == 'tell') {
      this.data.tell = e.detail.value
    }
  },
  hide: function () {
    if (this.data.show) {
      this.setData({
        show: false
      })
    }
  },
  show: function (e) {
    var self = this
    console.log(e)
    if (!this.data.show) {
      this.setData({
        show: true,
        flag: e.currentTarget.dataset.flag,
        placeholder: e.currentTarget.dataset.value
      })
      if (e.currentTarget.dataset.flag == 'tell') {
        wx.request({
          url: server_url + '/Deskmate/get_tell/id/' + app.globalData.uid,
          success: res => {
            self.setData({
              placeholder: res.data.data
            })
          }
        })
      }
    } else {
      if (this.data.flag == 'plan') {
        wx.request({
          url: server_url + '/Deskmate/change_plan',
          method: 'POST',
          data: {
            id: app.globalData.uid,
            plan: self.data.plan
          },
          success: res => {
            console.log(res.data)
            wx.showToast({
              title: '修改成功！',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              self.setData({
                plan: res.data.data,
                show: false
              })
            }, 1000)

          }
        })
      } else if (this.data.flag == 'tell') {
        wx.request({
          url: server_url + '/Deskmate/change_tell',
          method: 'POST',
          data: {
            id: app.globalData.uid,
            tell: self.data.tell
          },
          success: res => {
            console.log(res.data)
            wx.showToast({
              title: '发送成功！',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              self.setData({
                tell: res.data.data,
                show: false
              })
            }, 1000)
          }
        })
      }
    }

  },
  cancel: function () {
    wx.showModal({
      cancelColor: '#000000',
      confirmColor: '#000000',
      content: '确认解除同桌关系？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: server_url + '/Deskmate/cancel/id/' + this.data.deskmate.id + '/from/' + app.globalData.uid,
            success: res => {
              console.log(res.data)
              if (res.data.data.update == 2) {
                wx.showToast({
                  title: '解除成功',
                  duration: 1000
                })
                setTimeout(res => {
                  wx.navigateBack()
                }, 1000)
              }
            }
          })
        }
      }
    })

  },
  get_deskmate: function () {
    var self = this
    wx.request({
      url: server_url + '/Deskmate/get_dinfo/uid/' + app.globalData.uid,
      success: res => {
        console.log(res.data)
        self.setData({
          deskmate: res.data.data,
          plan: res.data.data.plan,
          tell: res.data.data.status
        })
      }
    })
  },
  onLoad: function (options) {
    var self=this
    this.get_deskmate()
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
    var self = this
    this.data.interval = setInterval(function () {
      wx.request({
        url: server_url + '/Deskmate/get_tell_status/id/' + app.globalData.uid,
        success: res => {
          console.log(res.data)
          self.setData({
            tell: res.data
          })
        }
      })
    }, 3000)
  },
  bindTouchStart: function (e) {
    // console.log(e)
    if (!this.data.isRunning) {
      wx.vibrateShort({
        type: 'heavy',
      })
    }
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    console.log('touchend')
    let that = this
    this.endTime = e.timeStamp;
    if (this.endTime - this.startTime > 350) {
      if (app.globalData.uid == 0) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
        return
      }
      if (this.data.isRunning) {
        return
      }
      wx.request({
        url: server_url + '/Study/start/uid/' + app.globalData.uid + '/did/' + that.data.deskmate.id,
        success: res => {
          that.data.study_id = res.data.data
          wx.vibrateShort({
            type: 'heavy',
          })
          that.formatTime(this)
          that.setData({
            isRunning: true
          });
          wx.enableAlertBeforeUnload({
            message: '放弃当前学习时长？',
          })
        }
      })

    }
  },
  bindTap: function (e) {
    var self = this
    if (this.data.isRunning == true) {
      wx.vibrateShort({
        type: 'heavy',
      })
      wx.showModal({
        title: '提示',
        content: '确认结束学习?',
        success(res) {
          if (res.confirm) {
            self.upLoad()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  upLoad() {
    var self = this
    // clear timer
    wx.showLoading({
      title: '上传学习记录中',
    })
    wx.request({
      url: server_url + '/Study/end/id/' + self.data.study_id,
      success: res => {
        console.log(res.data)
        if (res.data.code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            duration: 1000
          })
          self.timers && clearInterval(self.timers);
          self.setData({
            timer: '00:00',
            color: 'black',
            isRunning: false
          })
          wx.disableAlertBeforeUnload()
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'error'
          })
        }

      }
    })
  },
  bindLongPress: function (e) {
    console.log('longpress')
    if (this.data.isRunning == false) {
      console.log("长按");
      this.setData({
        color: '#04BF02'
      });
    }
  },
  timeUp: function (callback) {
    let _this = this
    let n = 0,
      timeee = '';
    let hour, minute, second; //时 分 秒
    hour = minute = second = 0; //初始化
    let millisecond = 0; //毫秒
    _this.timers = setInterval(function () {
      // console.log('timers')
      millisecond = millisecond + 50;
      if (millisecond >= 1000) {
        millisecond = 0;
        // console.log(millisecond);
        second = second + 1;
      }
      if (second >= 60) {
        second = 0;
        minute = minute + 1;
      }
      if (minute >= 60) {
        minute = 0;
        hour = hour + 1;
      }
      // if ( minute == 0 && second<60){
      //   timeee = _this.toDub(second) + ':' + _this.toDus(millisecond)
      // }else{
      timeee = _this.toDub(minute) + ':' + _this.toDub(second);
      // }
      callback(timeee);
    }, 50);
  },
  formatTime: function (that) {
    this.timeUp(function (val) {
      that.setData({
        timer: val
      });
    })
  },
  toDub: function (n) {
    return n < 10 ? "0" + n : "" + n;
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
    console.log('unload')
    clearInterval(this.data.interval)
    wx.disableAlertBeforeUnload()
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
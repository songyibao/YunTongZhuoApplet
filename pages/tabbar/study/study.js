// pages/tabbar/study/study.js
// var wxCharts = require('../../../wxcharts-min.js');
const server_url=require('../../../config.js').server_url
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records:[],
    starts:[]
  },
  draw:function(){
    var self=this
    new wxCharts({
      canvasId: 'zhexiantu',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
          name: '日期',
          data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
          format: function (val) {
              return val.toFixed(2) + '万';
          }
      }],
      yAxis: {
          title: '学习时长',
          format: function (val) {
              return val.toFixed(2);
          },
          min: 0
      },
      width: 480,
      height: 300
  });
  },
  format_time:function(seconds){
    var hour=parseInt(seconds/3600)
    var minute=parseInt(seconds%3600/60)
    var second=seconds%3600%60
    return hour+'时'+minute+'分'+second+'秒'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var self=this
    wx.request({
      url: server_url+'/Study/get_records/uid/'+app.globalData.uid,
      success:res=>{
        let arr=new Array()
        res.data.data.forEach(function(item,index){
          item.str=self.format_time(item.length)
          arr.push(item.start_time.substring(5,10))
        })
        self.setData({
          records:res.data.data,
          starts:arr
        })
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
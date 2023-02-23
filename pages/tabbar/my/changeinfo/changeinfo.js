const server_url = require('./../../../../config').server_url
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      user:{},
      tel:'',
      signature:'',
      intro:''
    },
    changeSign: function (e) {
        this.setData({
            signature: e.detail.value
        })
    },
    changeTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    changeIntro: function (e) {
        this.setData({
            intro: e.detail.value
        })
    },
    bindSubmit: function (e) {
        var self = this
        this.data.tel = (this.data.tel.replace(' ', '').length === 0) ? '' : this.data.tel.replaceAll(' ', '')
        this.data.signature = (this.data.signature.replace(' ', '').length === 0) ? '' : this.data.signature.replaceAll(' ', '')
        wx.request({
            url: server_url+'/User/change_info/uid/'+app.globalData.uid,
            method:'POST',
            data: {
                uid:app.globalData.id,
                tel: this.data.tel,
                signature: this.data.signature,
                intro:this.data.intro
            },
            success: res => {
                console.log('change_res', res.data)
                if(res.data.code==0){
                    app.globalData.userInfo = res.data.data
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

                // if (res.data === 'error') {
                //     wx.showToast({
                //         title: '检测到敏感文本，请修改后重试',
                //         icon: 'none',
                //         duration: 1000
                //     })
                // } else if (res.data.isregister) {
                //     wx.showToast({
                //         title: '注册成功',
                //         icon: 'success'
                //     }, 1000)
                //     setTimeout(function () {
                //         wx.switchTab({
                //             url: '/pages/topic/topic',
                //         })
                //     }, 1000)

                // } else {
                //     wx.showToast({
                //         title: '注册失败',
                //         icon: 'error'
                //     })
                // }
            },
            fail: res => {
            },
        })
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
        this.setData({
            user:app.globalData.userInfo,
            tel:app.globalData.userInfo.tel,
            intro:app.globalData.userInfo.intro,
            signature:app.globalData.userInfo.signature,
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
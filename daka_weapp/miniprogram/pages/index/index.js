const app = getApp()
const { setUserInfo, checkUserActivity, _savePunchDates } = app

const { db } = app.globalData
const common = require("../../util/common.js")
const wxLib = require("../../util/wxLib.js")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popShow1: false,
    popShow2: false,
    rule: '1月28日至2月18日，参与21天读书打卡挑战，完成15天打卡，即可为四川贫困地区孩子们的开学礼物助力一次，每5次助力将兑换成一本孩子们学习所需的工具书，超过1500次助力，好舍好得公益将捐出全部300本当地所需的工具书。\n\n 完成全部21天打卡，即可获得赢取黄金大奖的机会。2月19日0点，抽奖界面准时开启，届时获得抽奖机会的用户可进入本小程序抽奖界面，抽取大奖。',
    headerConfig: {
      title_text: '好舍好得新春读书会'
    }
  },

  onGotUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
      setUserInfo()
      wx.switchTab({
        url: '/pages/daka/index',
      })
    } else {
      console.log(e)
      console.log('用户拒绝授权')
    }

  },

  //弹窗
  togglePopup1: function() {
    this.setData({
      popShow1: !this.data.popShow1
    })
  },

  togglePopup2: function () {
    this.setData({
      popShow2: !this.data.popShow2
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.activity) {
      this.setData({ 
        activity: app.globalData.activity
      })
    } else {
      app.getActivityReadyCallback = res => {
        console.log('index page callback')
        if (res.data[0].end_date) {
          if (common.nowIsBefore(res.data[0].end_date)) {
            //活动未结束，查询活动信息
            console.log('开始云查询')
            wx.cloud.callFunction({
              name: 'checkUserActivity'
            }).then(res => {
              console.log(res)
              if (res.result.punched) {
                
                let punch_date_arr = []
                res.result.punch_data.forEach((item) => punch_date_arr.push(item.punch_date))
                _savePunchDates(punch_date_arr)
                
                //查询最近的打卡日期
                let gotoUrl = '/pages/daka/index'
                if (res.result.punch_data[0].punch_date) { 
                  if (res.result.punch_data[0].punch_date === common.dateFormat()) {
                    gotoUrl = '/pages/bookmark/index'
                  }
                }
                console.log(gotoUrl)
                wx.switchTab({
                  url: gotoUrl,
                })
              }
            })
          } else {
            //活动结束，跳转抽奖页面
            wx.navigateTo({
              url: '/pages/over/index'
            })
          }
        }

        this.setData({
          activity: res.data[0]
        })

      }
    }
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.gloabalFomIds = wxLib.saveFormIds(app.globalData.gloabalFomIds, wx.getStorageSync('_openid'), app.globalData.hadPunchedDays)
  },

  //处理表单推送码提交
  handleSubmit: function (e) {
    app.globalData.gloabalFomIds = wxLib.formSubmit(e, app.globalData.gloabalFomIds)
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
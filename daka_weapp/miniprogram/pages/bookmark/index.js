const app = getApp()
const { db } = app.globalData
const common = require("../../util/common.js")
const wxLib = require("../../util/wxLib.js")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerConfig: {
      title_text: '书签'
    },
    small_img_url: 'https://6461-daka-21day-staging-946037-1258528740.tcb.qcloud.la/daily-image/default_small.png',
    today: common.dateFormat(),
    activity_content: {},
    peoples: 0, //总人数
    punchCount: 0,  //打卡次数
    punch_dates: [], //已打卡日期
    all_dates: [], //所有日期
    allCount: 0, //活动总天数
    todayIndex: 0, //计算当天是活动第几天
    todayPunched: false, //当天是否已经打卡
    showData: [], //scroll-view组件数据
    scrollLeft: 400,
    btnDisabled: false //
  },
  
  handleBookmarkClick: function(e) {
    wx.navigateTo({
      url: `/pages/bookmark/share?date=${this.data.today}`,
    })
  },

  //图片点击
  handleImageClick: function (e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.date) {
      wx.navigateTo({
        url: `/pages/bookmark/share?date=${e.currentTarget.dataset.date}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //初始化
    this.setData({
      activity_content: app.globalData.activity_content
    })
    if (app.globalData.peoples) this.setData({ peoples: app.globalData.peoples })


    //整理已经打卡的日期
    let punch_dates = JSON.parse(wx.getStorageSync('punch_dates'))
    if (app.globalData.activity.start_date) {
      const start_date = common.dateFormat(app.globalData.activity.start_date)
      const end_date = common.dateFormat(app.globalData.activity.end_date)

      let filter_punch_dates = new Array()
      // punch_dates.push('2019-01-31')
      punch_dates.forEach( date => {
        // console.log(`${date} ${start_date} ${end_date}`)
        // console.log(common.isEqAfter(date, start_date))
        // console.log(common.isBefore(date, end_date))
        if (common.isBefore(date, end_date) && common.isEqAfter(date, start_date)) {
          filter_punch_dates.push(date)
        }
      })
      // console.log(filter_punch_dates)
      punch_dates = filter_punch_dates

      //拼装横向滚动组件的数据
      let all_dates = common.getRangeOfDates(start_date, end_date) //所有活动日期

      let todayIndex = all_dates.indexOf(this.data.today)
      if (punch_dates.indexOf(this.data.today) !== -1) {
        this.setData({ todayPunched: true })
      }

      let showData = []
      all_dates.forEach((item_date, key) => {
        if (punch_dates.indexOf(item_date) >= 0) {
          showData[key] = item_date
        } else {
          showData[key] = null
        }
      })

      console.log(showData)
      // debugger
      
      //设置
      this.setData({
        punchCount: punch_dates.length,
        allCount: all_dates.length,
        showData,
        todayIndex,
        all_dates,
        punch_dates
      })
    }

    //查询活动是否结束
    console.log(common.isAfter(common.dateFormat(), app.globalData.activity.end_date))
    if (app.globalData.activity.end_date) {
      if (common.isEqAfter(this.data.today, app.globalData.activity.end_date)) {
        this.setData({
          btnDisabled: true
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
    app.globalData.hadPunchedDays = this.data.punchCount
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
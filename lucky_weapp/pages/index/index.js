// index.js
const urls = require('../../utils/config')
let util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    endDate: '2018-12-31',
    dateSelected: false,
    timeSelected: false,
    sexChoice: [
      { name: 'male', value: '男', checked: 'true' },
      { name: 'female', value: '女' }
    ],
    uname: '',
    inputName: '',
    sex: '男',
    date: '请选择生日',
    time: '00:00',
    timeNotice: '不确定时间，默认为 '
  },
  onLoad: function () {
    // 开启shareTicket
    wx.showShareMenu({ withShareTicket: true })
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        uname: app.globalData.userInfo.nickName,
        inputName: app.globalData.userInfo.nickName
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          uname: app.globalData.userInfo.nickName,
          inputName: app.globalData.userInfo.nickName
        })
      }
    }
    // 获取 openid
    if (!app.globalData.openid) {
      app.getUserOpenid((err, openid) => {
        if (err) {
          wx.reLaunch({ url: '/pages/index/index' })
          return
        }
        app.globalData.openid = openid
      })
      return
    }
  },
  onShareAppMessage: util.onShareAppMessage,
  // 姓名
  nameChange: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  // 性别
  sexChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 日期
  dateChange: function (e) {
    let data = {
      date: e.detail.value
    }
    if (e.detail.value !== this.data.date) {
      data['dateSelected'] = true
    }
    this.setData(data)
  },
  // 时间
  timeChange: function (e) {
    let data = {
      time: e.detail.value,
      timeSelected: true
    }
    this.setData(data)
  },
  // 下单提交
  toInfo: function () {
    let openid = app.globalData.openid
    let uname = this.data.uname
    let inputName = this.data.inputName
    let sex = this.data.sex
    let dateArr = this.data.date.split('-')
    let yy = dateArr[0]
    let mm = dateArr[1]
    let dd = dateArr[2]
    let hh = this.data.time.split(':')[0]
    if (!openid) {
      wx.showToast({
        title: '出错啦！',
        icon: 'success',
        mask: true,
        duration: 1000,
        success: () => {
          wx.reLaunch({ url: '/pages/index/index' })
        }
      })
      return
    }
    if (!inputName) {
      wx.showToast({
        title: '请输入名字',
        icon: 'success',
        mask: true,
        duration: 1000,
        success: () => { }
      })
      return
    }
    if (!this.data.dateSelected) {
      wx.showToast({
        title: '请选择生日',
        icon: 'success',
        mask: true,
        duration: 1000,
        success: () => { }
      })
      return
    }

    // 下单
    wx.request({
      url: urls.order.url,
      data: {
        openid: openid,
        headUrl: app.globalData.userInfo.avatarUrl,
        uname: uname,
        inputName: inputName,
        sex: sex,
        yy: yy,
        mm: mm,
        dd: dd,
        hh: hh
      },
      method: urls.order.method,
      success: function (res) {
        wx.navigateTo({
          url: '/pages/info/info?orderId=' + res.data.order.orderId
        })
      },
      fail: function (res) {
        console.log('order.url fail', res)
        wx.reLaunch({ url: '/pages/index/index' })
      }
    })
  },
  // 个人中心
  toMyOrder: function () {
    wx.navigateTo({
      url: '/pages/user/user'
    })
  }
})

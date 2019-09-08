const urls = require('../../../utils/config')
let util = require('../../../utils/util')
const app = getApp()
Page({
  data: {
    userInfo: {},
    tags: [
      { name: '全部订单', show: true },
      { name: '未支付', show: false },
      { name: '已支付', show: false }
    ],
    currentTag: 0,
    // 订单
    orders: []
  },
  onLoad: function () {
    wx.showShareMenu({ withShareTicket: true })
    let that = this
    wx.request({
      url: urls.myorder.url,
      data: {
        openid: app.globalData.openid
      },
      method: urls.myorder.method,
      success: function (res) {
        let list = res.data.list
        if (list.err) {
          wx.showToast({
            title: '出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => { wx.navigateBack({}) }
          })
          return
        }
        that.setData({
          userInfo: app.globalData.userInfo,
          orders: list
        })
      },
      fail: function (res) {
        console.log('', res)
        wx.navigateBack({})
      }
    })
  },
  onShareAppMessage: util.onShareAppMessage,
  changeTag: function (e) {
    let tags = this.data.tags
    let currentTag = this.data.currentTag
    for (let index = 0; index < tags.length; ++index) {
      if (index === e.currentTarget.dataset.index) {
        tags[index].show = true
        currentTag = index
      } else {
        tags[index].show = false
      }
    }
    this.setData({
      tags: tags,
      currentTag: currentTag
    })
  },
  toInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/info?orderId=' + e.currentTarget.dataset.id
    })
  }
})

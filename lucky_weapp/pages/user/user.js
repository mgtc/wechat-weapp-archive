const urls = require('../../utils/config')
let util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    userInfo: {},
    tags: [
      { name: '全部订单', state: true },
      { name: '未支付', state: false },
      { name: '已支付', state: false }
    ],
    tagNum: 0,
    // 订单
    orders: []
  },
  onLoad: function () {
    wx.showShareMenu({ withShareTicket: true })
    this.setData({
      userInfo: app.globalData.userInfo,
      orders: []
    })
  },
  onShareAppMessage: util.onShareAppMessage,
  changeTag: function (e) {
    let tags = this.data.tags
    let tagNum = this.data.tagNum
    for (let index = 0; index < tags.length; ++index) {
      if (index === e.currentTarget.dataset.index) {
        tags[index].state = true
        tagNum = index
      } else {
        tags[index].state = false
      }
    }
    this.setData({
      tags: tags,
      tagNum: tagNum
    })
  },
  // 我的订单
  toOrderList: function (e) {
    wx.navigateTo({
      url: '/pages/user/orderlist/orderlist'
    })
  },
  // 我的拼团
  toGroupList: function (e) {
    wx.navigateTo({
      url: '/pages/user/grouplist/grouplist'
    })
  }
})

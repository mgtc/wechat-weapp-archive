const urls = require('../../../utils/config')
let util = require('../../../utils/util')
const app = getApp()
Page({
  data: {
    userInfo: {},
    tags: [
      { name: '拼团中', state: true },
      { name: '已完成', state: false }
    ],
    currentTag: 0,
    // 订单
    groups: []
  },
  onLoad: function () {
    wx.showShareMenu({ withShareTicket: true })
    let that = this
    wx.request({
      url: urls.mygroup.url,
      data: {
        openid: app.globalData.openid
      },
      method: urls.mygroup.method,
      success: function (res) {
        let list = res.data.list
        console.log(list)
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
          groups: list
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
        tags[index].state = true
        currentTag = index
      } else {
        tags[index].state = false
      }
    }
    this.setData({
      tags: tags,
      currentTag: currentTag
    })
  },
  toGroup: function (e) {
    wx.navigateTo({
      url: '/pages/group/group?groupid=' + e.currentTarget.dataset.id
    })
  }
})

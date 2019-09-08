const urls = require('/utils/config')
// app.js
App({
  onLaunch: function (options) {
    console.log(options)
    this.getUserInfo()
  },
  // 获取用户信息
  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  // 获取openid
  getUserOpenid: function (callback) {
    var self = this
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
      return
    }
    // login，从后台获取
    wx.login({
      success: function (res) {
        wx.request({
          url: urls.login.url,
          data: {
            code: res.code
          },
          method: urls.login.method,
          success: function (res) {
            self.globalData.openid = res.data.openid
            callback(null, self.globalData.openid)
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
            callback(res)
          }
        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        callback(err)
      }
    })
    return
  },
  globalData: {
    userInfo: null,
    openid: null,
    orders: {}
  }
})

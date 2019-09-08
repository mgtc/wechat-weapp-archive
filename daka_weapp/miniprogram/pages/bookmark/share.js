const app = getApp()
const common = require("../../util/common.js")
const wxLib = require("../../util/wxLib.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_content: {},
    default_content: {
      author: '哲学的盛宴',
      summary: '读史使人明智，读诗使人聪慧，数学使人精密，哲理使人深刻，伦理学使人有修养，逻辑修辞使人善辩。',
      comment: '做一株永远追逐阳光的向日葵，心向阳光，以一颗宽容之心处世，我们也将被这个世界温柔以待。',
      thumb_img_url: 'https://6461-daka-21day-staging-946037-1258528740.tcb.qcloud.la/daily-image/default_thumb.png',
      origin_img_url: '',
      poster_img_url: 'https://6461-daka-21day-staging-946037-1258528740.tcb.qcloud.la/daily-image/default_poster.png'
    },
    shareDate: common.dateFormat(new Date()),
    year: common.dateFormat(new Date(), "YYYY/MM"),
    month: common.dateFormat(new Date(), "MMMM"),
    day: common.dateFormat(new Date(), "DD")
  },

  handleGoHome: () => {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
 *  分享-保存到相册
 */
  sharePhoto: function (e) {
    let _this = this
    let posterUrl = e.currentTarget.dataset.posterUrl

    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              console.log('scope.writePhotosAlbum')
              _this._saveToAlbum(posterUrl)
            },
            fail: function (e) {
              wx.showModal({
                title: '图片生成失败',
                content: '微信授权失败',
              })
            }
          })
        } else {
          _this._saveToAlbum(posterUrl)
        }
      }
    })
  },

  _saveToAlbum: function (posterUrl) {
    let _this = this;
    wx.showLoading({
      title: '海报生成中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)

    wx.downloadFile({
      url: posterUrl,
      success: function (res) {

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })

        wx.hideLoading()
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    if (options.date) {
      this.setData({ 
        shareDate: options.date,
        year: common.dateFormat(options.date, "YYYY/MM"),
        month: common.dateFormat(options.date, "MMMM"),
        day: common.dateFormat(options.date, "DD")
      })
    }

    
    //设置活动内容
    if (app.globalData.activity_content) {
      let arr = app.globalData.activity_content
      arr.forEach( item => {
        if (item.assign_date == this.setData.shareDate) {
          this.setData({
            activity_content: item
          })
        }
      })
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
    return {
      title: '读书做公益，开卷嬴黄金~',
      path: '/pages/index/index'
    }
  }
})
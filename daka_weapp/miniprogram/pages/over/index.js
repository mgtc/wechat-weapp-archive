import Wheel from '../../components/wheel/wheel.js'
const common = require("../../util/common.js")
const app = getApp()
const { db } = app.globalData
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '活动已结束',
    lotteryCount: 0,
    showWheel: false,
    mode: 1,
    _openid: wx.getStorageSync('_openid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 查询抽奖次数
    db.collection('activity_users').where({
      _openid: this.data._openid,
      done: true,
    }).get({
      success: res => {
        console.log(res)

        if (res.data[0].lotteryCount && res.data[0].lotteryCount > 0) {

          this.setData({
            lotteryCount: res.data[0].lotteryCount
          })

          //满足抽奖条件，显示大转轮
          if (this.data.lotteryCount > 0) {
            this.setData({
              showWheel: true
            })
            this.runWheel()
          }

        }
      }
    })

  },

  /**
   * 大转轮传入数据
   */
  runWheel: function() {
    const self = this

    this.wheel = new Wheel(this, {
      areaNumber: 8,
      speed: 16,
      awardNumer: common.getRandomNumber(1, 8),
      mode: 1,
      callback: () => {
        let content = ''
        switch (self.wheel.awardNumer ) {
          case 1:
            content = '一等奖'
            break;
          case 3:
            content = '二等奖'
            break;
          case 5:
            content = '三等奖'
            break;
          case 7:
            content = '四等奖'
            break;
          default:
            content = '抱歉，没有中奖'
        }

        // 抽奖次数减1
        self.setData({
          lotteryCount: self.data.lotteryCount - 1
        })
        // 更新线上抽奖次数
        wx.showModal({
          title: '提示',
          content: content,
          showCancel: false,
          success: res => {
            // debugger
            // self.wheel.reset()
            //下一次中奖区域
            self.wheel.awardNumer = common.getRandomNumber(1, 8)
            if (self.data.lotteryCount <= 0) {
              wx.showModal({
                title: '提示',
                content: '亲您的抽奖机会已经用完',
                showCancel: false,
              })
              self.setData({
                showWheel: false
              })
            }

          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
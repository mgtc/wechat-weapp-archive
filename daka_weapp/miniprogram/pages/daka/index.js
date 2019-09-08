// pages/daka/index.js
const app = getApp()
const { _savePunchDates } = app
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
      title_text: '好舍好得新春读书会'
    },
    activity_content: {},
    default_content: {
      author: '哲学的盛宴',
      summary: '读史使人明智，读诗使人聪慧，数学使人精密，哲理使人深刻，伦理学使人有修养，逻辑修辞使人善辩。',
      comment: '做一株永远追逐阳光的向日葵，心向阳光，以一颗宽容之心处世，我们也将被这个世界温柔以待。',
      thumb_img_url: 'https://6461-daka-21day-staging-946037-1258528740.tcb.qcloud.la/daily-image/default_thumb.png',
      origin_img_url: '',
      poster_img_url: 'https://6461-daka-21day-staging-946037-1258528740.tcb.qcloud.la/daily-image/default_poster.png'
    },
    curIndex: 0,
    activity: {}, //活动信息
    today: common.dateFormat(),
    theDay: 0, //活动第几天
    peoples: 0, //总人数
    punchCount: 0,  //打卡次数
    punchDates: [], //打卡数据
    lottery: 0, //抽奖次数
    punchButtonDisable: false,
    punchButtonText: '打卡',
    _openid: wx.getStorageSync('_openid')
  },

  /**
   * Tab 切换
   */
  onTabChange(event) {
    wx.showToast({
      title: `切换到第 ${event.detail.index + 1} 天书签`,
      icon: 'none'
    });
  },

  /**
   * 打卡
   */
  onPunchClick: function(e) {
    wx.showLoading({
      title: '打卡中...',
      mask: true
    })
    let punchDates = this.data.punchDates

    if (punchDates.indexOf(this.data.today) > -1) {
      console.log('重复打卡')
      this.setData({ punchButtonDisable: true, punchButtonText: '已打卡' })
    } else {
      //云函数打卡
      // wx.cloud.callFunction({
      //   name: 'punch'
      // }).then(res => {
      //   console.log('等待打卡结果')
      //   console.log(res)
      // })
      
      //本地请求打卡
      db.collection('activity_punch_data').where({
        _openid: this.data._openid,
        done: true,
        punch_date: this.data.today
      }).count().then(res => {
        if (res.total > 0) {
          console.log('重复打卡')
        } else {
          //个人打卡数据
          db.collection('activity_punch_data').add({
            data: {
              create_at: new Date(),
              punch_date: this.data.today,
              done: true
            }
          }).then(res2 => {
            console.log(res2)
            wx.hideLoading()
            wx.showToast({
              title: '打卡成功',
              complete: () => {
                wx.switchTab({
                  url: '/pages/bookmark/index',
                })
              }
            })
            //更改页面状态
            _savePunchDates(this.data.today)
            this.setData({
              punchButtonDisable: true, 
              punchButtonText: '已打卡',
              punchCount: ++this.data.punchCount,
              lottery: Math.floor(++this.data.punchCount / 7)
            })

            //打卡汇总
            db.collection('activity_users').where({_openid: this.data._openid}).count().then( t => {
              if (t.total == 0) {
                db.collection('activity_users').add({
                  data: {
                    activity_id: this.data.activity._id,
                    done: true
                  }
                })
              }
            })
          }).catch(console.error)

        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({
      activity_content: app.globalData.activity_content,
      activity: app.globalData.activity,
      peoples: app.globalData.peoples
    })

    //如果存在活动信息
    if (Object.keys(this.data.activity).length > 0) {
      let res = this.data.activity
      console.log(res)
      //计算活动时间差
      let theDay = 0
      if (res.start_date && res.end_date) {
        let dayDiff = common.dayDiff(res.start_date, res.end_date)

        switch (dayDiff) {
          case NaN:
            console.log('时间格式错误')
            this.setData({ punchButtonDisable: true, punchButtonText: '未开始' })
            break
          case 0:
            console.log('活动还未开始')
            this.setData({ punchButtonDisable: true, punchButtonText: '未开始' })
            break
          case -1:
            console.log('活动已经结束')
            this.setData({ punchButtonDisable: true, punchButtonText: '已结束' })
            theDay = dayDiff
            break
          default:
            theDay = common.dayDiff(res.start_date, new Date())
            console.log(theDay)
        }
      }

      app.globalData.hadPunchedDays = theDay

      this.setData({
        curIndex: theDay,
        theDay: ++theDay
      })
    }

    //查询用户打卡数据
    wx.cloud.callFunction({
      name: 'login'
    }).then( response => {
      wx.hideLoading()
      let _openid = response.result.openid
      wx.setStorageSync('_openid', response.result.openid)
      this.setData({_openid})
      db.collection('activity_punch_data')
        .field({
          done: true,
          punch_date: true
        }).where({
          create_at: _.gt(this.data.activity.start_date),
          _openid
          }).get().then(res => {
          console.log(res)

          if (res.data.length > 0) {
            let punchDates = [], punchCount=0
            res.data.forEach( item => punchDates.push(item.punch_date))

            //打卡数据不为空，保存到本地
            wx.getStorageInfoSync('punch', punchDates) 

            if (punchDates.indexOf(this.data.today) > -1) {
              this.setData({ punchButtonDisable: true, punchButtonText: '已打卡' })

              //今天已经打卡，出现提示，并跳转到书签页面
              
            }

            this.setData({
              punchDates,
              punchCount:punchDates.length,
              lottery: Math.floor(punchDates.length / 7)
            })
          }

        })

    })

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

const wxCharts = require('../../utils/wxcharts-min.js')
const urls = require('../../utils/config')
const price = require('../../utils/price')
const app = getApp()
Page({
  data: {
    price: price,
    months: [
      { tgdz: '甲寅', duration: '02.04 ~ 03.05' },
      { tgdz: '乙卯', duration: '03.05 ~ 04.05' },
      { tgdz: '丙辰', duration: '04.05 ~ 05.05' },
      { tgdz: '丁巳', duration: '05.05 ~ 06.06' },
      { tgdz: '戊午', duration: '06.06 ~ 07.07' },
      { tgdz: '己未', duration: '07.07 ~ 08.07' },
      { tgdz: '庚申', duration: '08.07 ~ 09.08' },
      { tgdz: '辛酉', duration: '09.08 ~ 10.08' },
      { tgdz: '壬戌', duration: '10.08 ~ 11.07' },
      { tgdz: '癸亥', duration: '11.07 ~ 12.07' },
      { tgdz: '甲子', duration: '12.07 ~ 01.05' },
      { tgdz: '乙丑', duration: '01.05 ~ 02.04' }
    ],
    hint: [
      {
        title: '性格',
        desc: [
          'desc1',
          'desc2',
          'desc3'
        ]
      }, {
        title: '喜好',
        desc: [
          'desc1',
          'desc2',
          'desc3'
        ]
      }, {
        title: '总评',
        desc: [
          'desc1',
          'desc2',
          'desc3'
        ]
      }, {
        title: '运势',
        desc: [
          'desc1',
          'desc2',
          'desc3'
        ]
      }
    ],
    // 动态数据
    inputName: '',
    sex: '女',
    yy: { time: '0001', bazi: '丙丙' },
    mm: { time: '01', bazi: '丙丙' },
    dd: { time: '01', bazi: '丙丙' },
    hh: { time: '01', bazi: '丙丙' },
    score: [],
    // 付费
    colors: {
      'green': '绿',
      'red': '红',
      'yellow': '黄',
      'white': '白',
      'black': '黑'
    },
    emoji: {
      '木': '🌲',
      '火': '🔥',
      '土': '🌏',
      '金': '🌟',
      '水': '💧'
    },
    // 已解锁
    charDesc: [],
    idol: [],
    eleLike: {},
    yearDesc: '',
    monthDesc: [],
    force: { '水': 0, '金': 0, '土': 0, '火': 0, '木': 0 },
    // 团购中
    groupid: null,
    groupMember: [],
    orderId: null,
    state: null // 订单状况
  },
  onLoad: function (options) {
    wx.showShareMenu({ withShareTicket: true })
    if (!options.orderId) {
      wx.navigateBack({})
    }
    this.setData({
      orderId: options.orderId
    })
  },
  onShow: function () {
    if (!app.globalData.openid) {
      wx.showLoading({
        title: '加载中'
      })
      app.getUserOpenid((err, openid) => {
        if (err) {
          return
        }
        app.globalData.openid = openid
        wx.hideLoading()
        this.refresh()
      })
      return
    }
    this.refresh()
  },

  onShareAppMessage: function () {
    return {
      withShareTicket: true,
      title: this.data.groupid ? '快来团购解锁18年运势' : '解锁XXX运势',
      path: this.data.groupid ? '/pages/group/group?groupid=' + this.data.groupid : '/pages/index/index',
      imageUrl: this.data.groupid ? '/static/common/card2.png' : '/static/common/card1.png',
      success: res => {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: res => { },
          fail: res => { }
        })
        wx.showToast({
          title: this.data.groupid ? '团购已在路上' : '分享成功',
          icon: 'success',
          duration: 1000,
          mask: true,
          success: () => { }
        })
      }
    }
  },
  // 绘图
  drawChart: function () {
    let ratioWidth = 350 / 414
    let ratioHeight = 200 / 672
    let res = wx.getSystemInfoSync()
    // 月运势
    new wxCharts({
      canvasId: 'score-chart',
      type: 'area',
      dataLabel: false,
      legend: false,
      categories: [
        '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月', '1月'
      ],
      series: [{
        name: '运势',
        data: this.data.score,
        format: function (val) {
          return val.toFixed(0) + '分';
        }
      }],
      xAxis: {
        fontColor: '#756F92',
        disableGrid: true
      },
      yAxis: {
        gridColor: '#ffffff',
        fontColor: '#756F92',
        format: function (val) {
          return val + '分';
        }
      },
      extra: {
        lineStyle: 'curve'
      },
      width: ratioWidth * res.windowWidth,
      height: ratioHeight * res.windowHeight,
      background: '#f8f5f1'
    })

    // 五行力量
    let pieRatioW = 336 / 414
    let pieRatioH = 276 / 672
    let percent = {}
    for (const key in this.data.force) {
      percent[key] = (this.data.force[key] / 100).toFixed(2) + '%'
    }
    new wxCharts({
      canvasId: 'element-chart',
      type: 'pie',
      dataLabel: false,
      series: [{
        name: '木: ' + percent['木'],
        data: this.data.force['木'],
        color: '#466F3F'
      }, {
        name: '火: ' + percent['火'],
        data: this.data.force['火'],
        color: '#F86D34'
      }, {
        name: '土: ' + percent['土'],
        data: this.data.force['土'],
        color: '#DFAA45'
      }, {
        name: '金: ' + percent['金'],
        data: this.data.force['金'],
        color: '#F4DE45'
      }, {
        name: '水: ' + percent['水'],
        data: this.data.force['水'],
        color: '#3ABEF2'
      }],
      extra: {
      },
      width: pieRatioW * res.windowWidth,
      height: pieRatioH * res.windowHeight,
    })
  },
  // 支付
  toPay: function (e) {
    let that = this
    let fee = e.currentTarget.dataset.group === '1' ? price.discount : price.original
    // 请求支付
    wx.request({
      url: urls.pay.url,
      data: {
        openid: app.globalData.openid,
        orderId: this.data.orderId,
        fee: fee,
        isGroup: e.currentTarget.dataset.group
      },
      method: urls.pay.method,
      success: function (res) {
        let resData = res.data
        let payObj = resData.payObj
        if (resData.err) {
          wx.showToast({
            title: 'pay 出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => { }
          })
          return
        }
        that.setData({
          orderId: payObj.orderId
        })
        // 客户端支付
        wx.requestPayment({
          appId: 'XXXXX',
          timeStamp: payObj.timeStamp,
          nonceStr: payObj.nonceStr,
          package: payObj.package,
          signType: payObj.signType,
          paySign: payObj.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              mask: true,
              duration: 1500,
              success: () => {
                // 团购
                if (e.currentTarget.dataset.group === '1') {
                  that.toGroup()
                } else {
                  // 直接购买
                  that.refresh()
                }
              }
            })
            return
          }
        })
      },
      fail: function (res) {
        console.log('', res)
        wx.showToast({
          title: 'pay request 出错啦',
          icon: 'success',
          mask: true,
          duration: 1000,
          success: () => { }
        })
      }
    })
  },
  // 刷新页面
  refresh: function () {
    let that = this
    // 已解锁的无需在刷新
    if (this.data.state === 1) {
      return
    }
    // 请求数据
    wx.request({
      url: urls.orderinfo.url,
      data: {
        openid: app.globalData.openid,
        orderId: this.data.orderId
      },
      method: urls.orderinfo.method,
      success: function (res) {
        let resData = res.data
        let thisOrder = resData.orderInfo
        if (resData.err) {
          wx.showToast({
            title: '请求订单出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
          return
        }
        let dataSet = {
          inputName: thisOrder.inputName,
          sex: thisOrder.sex,
          yy: thisOrder.yy,
          mm: thisOrder.mm,
          dd: thisOrder.dd,
          hh: thisOrder.hh,
          score: thisOrder.score,
          state: thisOrder.state
        }

        if (thisOrder.state === 1) {
          // 已解锁
          dataSet['charDesc'] = thisOrder.charDesc
          dataSet['idol'] = thisOrder.idol
          dataSet['eleLike'] = thisOrder.eleLike
          dataSet['yearDesc'] = thisOrder.yearDesc
          dataSet['monthDesc'] = thisOrder.monthDesc
          dataSet['force'] = thisOrder.force
        } else if (thisOrder.state === 2) {
          // 团购中
          dataSet['groupid'] = thisOrder.groupid
          dataSet['groupMember'] = thisOrder.groupMember
        } else {// 未支付
        }
        that.setData(dataSet)
        that.drawChart();
      },
      fail: function (res) {
        // 重启或者退回上一页
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  },
  // 去往团购页面
  toGroup: function () {
    // 获取团购号
    let that = this
    wx.request({
      url: urls.orderinfo.url,
      data: {
        openid: app.globalData.openid,
        orderId: this.data.orderId
      },
      method: urls.orderinfo.method,
      success: function (res) {
        let resData = res.data
        let thisOrder = resData.orderInfo
        if (resData.err) {
          wx.showToast({
            title: '请求订单出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
          return
        }

        if (thisOrder.state !== 2) {
          wx.showToast({
            title: '请求订单出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
          return
        }
        wx.navigateTo({
          url: '/pages/group/group?groupid=' + thisOrder.groupid
        })
      },
      fail: function (res) {
        console.log('', res)
        // 重启或者退回上一页
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  }
})

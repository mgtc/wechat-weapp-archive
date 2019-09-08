const urls = require('../../utils/config')
const price = require('../../utils/price')
const util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    // 倒计时
    clock: '',
    showModalStatus: false,
    animationData: {},
    endDate: '2018-12-31',
    dateSelected: false,
    timeSelected: false,
    sexChoice: [
      { name: 'male', value: '男', checked: 'true' },
      { name: 'female', value: '女' }
    ],
    // 输入 && 提交
    uname: '',
    inputName: '',
    sex: '男',
    date: '请选择生日',
    time: '00:00',
    timeNotice: '不确定时间，默认为 ',
    // 团购
    isGroup: '0',
    groupid: '',
    // 价格
    price: price,
    member: [],
    timeRemain: null,
    partake: false,
    finished: true,
    orderId: '',
    // 其他
    userInfo: {},
    openid: null
  },
  onLoad: function (options) {
    wx.showShareMenu({ withShareTicket: true })
    if (!options.groupid) {
      console.log('团购号缺失')
      wx.showToast({
        title: resData.err,
        icon: 'success',
        mask: true,
        duration: 1000,
        success: () => { wx.navigateBack({}) }
      })
      return
    }

    if (app.globalData.userInfo) {
      this.setData({
        groupid: options.groupid,
        openid: app.globalData.openid,
        uname: app.globalData.userInfo.nickName,
        inputName: app.globalData.userInfo.nickName
      })
    } else {
      this.setData({
        groupid: options.groupid,
        openid: app.globalData.openid
      })
      app.userInfoReadyCallback = res => {
        this.setData({
          uname: app.globalData.userInfo.nickName,
          inputName: app.globalData.userInfo.nickName
        })
      }
    }
  },
  onShow: function () {
    let that = this
    if (!app.globalData.openid) {
      app.getUserOpenid((err, openid) => {
        if (err) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
          return
        }
        app.globalData.openid = openid
        this.setData({
          openid: openid
        })
        this.getGroupInfo()
      })
      return
    }
    this.getGroupInfo()
  },
  // 分享
  onShareAppMessage: function () {
    return {
      withShareTicket: true,
      title: '快来团购解锁18年运势',
      path: '/pages/group/group?groupid=' + this.data.groupid,
      imageUrl: '/static/common/card2.png',
      success: res => {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: res => { },
          fail: res => { }
        })
        wx.showToast({
          title: '团购已在路上',
          icon: 'success',
          duration: 1000,
          mask: true,
          success: () => { }
        })
      }
    }
  },
  // 获取团购数据
  getGroupInfo: function () {
    let that = this
    wx.request({
      url: urls.groupinfo.url,
      data: {
        openid: app.globalData.openid,
        groupid: this.data.groupid
      },
      method: urls.groupinfo.method,
      success: function (res) {
        let resData = res.data
        let groupInfo = resData.groupInfo

        if (resData.err) {
          console.log(resData.err)
          wx.showToast({
            title: resData.err,
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => { }
          })
          return
        }

        let dataSet = {
          member: groupInfo.member,
          timeRemain: groupInfo.timeRemain,
          partake: groupInfo.partake,
          finished: groupInfo.finished,
          orderId: groupInfo.orderId
        }
        that.setData(dataSet)
        if (!that.data.finished) {
          util.countDown(that, that.data.timeRemain)
        }
      },
      fail: function (res) {
        console.log('刷新通信失败', res)
        // 重启或者退回上一页
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  },
  // 团购满员后，查看报告
  toOrder: function (e) {
    console.log(this.data.orderId)
    wx.navigateTo({
      url: '/pages/info/info?orderId=' + this.data.orderId
    })
  },
  showModal: function (e) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      isGroup: e.currentTarget.dataset.group
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
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
      time: e.detail.value
    }
    if (e.detail.value !== this.data.time) {
      data['timeSelected'] = true
    }
    this.setData(data)
  },

  // 支付
  payToInfo: function () {
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
      success: res => {
        this.orderHandler(res.data.order)
      },
      fail: function (res) {
        console.log('order.url fail', res)
        wx.navigateBack({})
      }
    })
  },

  orderHandler: function (order) {
    let that = this
    // 已付费
    if (order.state) {
      // 团购中
      if (order.grouping) {
        wx.showToast({
          title: '该八字在拼过团',
          icon: 'success',
          mask: true,
          duration: 1500,
          success: () => { }
        })
        return
      }
      wx.showToast({
        title: '该八字已解锁',
        icon: 'success',
        mask: true,
        duration: 1500,
        success: () => { }
      })
      return
    }

    // 未付费，请求支付
    let fee = this.data.isGroup === '1' ? price.discount : price.original
    wx.request({
      url: urls.pay.url,
      data: {
        openid: app.globalData.openid,
        orderId: order.orderId,
        groupid: this.data.groupid,
        isGroup: this.data.isGroup,
        fee: fee
      },
      method: urls.pay.method,
      success: function (res) {
        let resData = res.data
        let payObj = resData.payObj
        // console.log(resData)
        if (resData.err) {
          wx.showToast({
            title: '支付出错啦',
            icon: 'success',
            mask: true,
            duration: 1000,
            success: () => { }
          })
          return
        }
        // 客户端支付
        wx.requestPayment({
          appId: 'XXXX',
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
                if (that.data.isGroup === '1') {
                  that.getGroupInfo()
                } else {
                  wx.navigateTo({
                    url: '/pages/info/info?orderId=' + order.orderId
                  })
                }
              }
            })
            return
          },
          fail: function (res) {
            wx.showToast({
              title: res.errMsg,
              icon: 'success',
              mask: true,
              duration: 1500,
              success: () => { }
            })
            return
          }
        })
      },
      fail: function (res) {
        console.log('', res)
        wx.showToast({
          title: '支付请求出错',
          icon: 'success',
          mask: true,
          duration: 1500,
          success: () => { }
        })
      }
    })
  },
  // 前往主页，发起新单
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})

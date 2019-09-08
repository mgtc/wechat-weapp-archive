// import regeneratorRuntime from 'util/wxPromise.min.js'
//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'daka-21day-staging-946037',
        traceUser: true,
      })

      var db = wx.cloud.database({
        env: 'daka-21day-staging-946037'
      })

      wx.showLoading({
        title: '加载中'
      })
    }

    //设置全局数据
    this.globalData = {
      gloabalFomIds: [],
      hadPunchedDays: 0, //记录进度
      db
    }

    //查询活动信息
    db.collection('activity_list').get().then(res => {
      wx.hideLoading()
      if (res.data.length > 0) {
        _this.globalData.activity = res.data[0]
      } else {
        wx.showToast({
          title: '未查询到活动',
          icon: 'none',
          duration: 3000
        })
      }

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.getActivityReadyCallback) {
        this.getActivityReadyCallback(res)
      }
    })

    //查询设备型号
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        _this.globalData.model = res.model
      },
    })

    //查询活动内容
    db.collection('activity_content').orderBy('id', 'asc').get().then(res => {
      console.log('activity_content')
      console.log(res)
      _this.globalData.activity_content = res.data
    })
    
    //查询活动参加总人数
    const _ = db.command
    db.collection('activity_users').where({
      _openid: _.neq(null),
      done: true
    }).count().then(res => {
      _this.globalData.peoples = res.total
    })

    this.checkStorageOpenid()

    //测试数据
    console.log(this.globalData)

  },

  //保存打卡数据到本地缓存
  _savePunchDates: function(arr) {
    let storage_punch_dates = wx.getStorageSync('punch_dates')
    if (arr instanceof Array) {
      wx.setStorageSync('punch_dates', JSON.stringify(arr))
    } else {
      let storage_punch_dates_arr = JSON.parse(storage_punch_dates)
      let new_date = arr
      if (storage_punch_dates_arr.indexOf(new_date) < 0){
        storage_punch_dates_arr.push(new_date) 
      }
      wx.setStorageSync('punch_dates', JSON.stringify(storage_punch_dates_arr))
    }
  },

  //检查本地Storage里的openid
  checkStorageOpenid() {
    if (!wx.getStorageSync('_openid')) {
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        wx.setStorageSync('_openid', res.result.openid)
      })
    }
  },

  setJWT(token) {
    // const _token = JSON.stringify(token)
    const _token = token
    wx.setStorageSync('jwt', _token)
    this.globalData.jwt = token
  },

  removeJWT() {
    wx.removeStorageSync('jwt')
    this.globalData.jwt = {}
  },

  /**
   * 调用getUserInfo获取头像昵称，写入数据库
   */
  setUserInfo: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              //存入云开发数据库
              if (res.userInfo.nickName) {
                const db = wx.cloud.database()

                db.collection('user_list').where({
                  _openid: this.globalData.openid
                }).count().then(queryRes => {

                  if (queryRes.total == 0) {
                    db.collection('user_list').add({
                      data: {
                        is_auth: true,
                        nickName: res.userInfo.nickName,
                        gender: res.userInfo.gender,
                        language: res.userInfo.language,
                        city: res.userInfo.city,
                        province: res.userInfo.province,
                        avatarUrl: res.userInfo.avatarUrl,
                        userInfo: res.userInfo,
                        update_time: new Date()
                      }
                    }).then(res => {
                      console.log('用户首次登录，信息已保存')
                      console.log(res)
                    }).catch(console.error)
                  }

                })
              }
            }
          })
        }
      }
    })

  }
})
module.exports = {
  countDown: function (that, total_micro_second) {
    // 渲染倒计时时钟
    that.setData({
      clock: this.dateFormat(total_micro_second) + '后结束'
    });

    if (total_micro_second <= 0) {
      that.setData({
        clock: '😊继续分享，集齐四人，解锁报告😊'
      });
      return;
    }
    setTimeout(() => {
      total_micro_second -= 10;
      this.countDown(that, total_micro_second);
    }, 10)
  },

  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  dateFormat: function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = this.fillZeroPrefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = this.fillZeroPrefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = this.fillZeroPrefix(Math.floor((micro_second % 1000) / 10));

    return hr + ":" + min + ":" + sec + " " + micro_sec;
  },

  // 位数不足补零
  fillZeroPrefix: function (num) {
    return num < 10 ? "0" + num : num
  },
  onShareAppMessage: function (options) {
    return {
      withShareTicket: true,
      title: 'XX运势2018个人年运报告',
      path: '/pages/index/index',
      imageUrl: '/static/common/card1.png',
      success: res => {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: res => { },
          fail: res => { }
        })
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000,
          mask: true,
          success: () => { }
        })
      }
    }
  }
}

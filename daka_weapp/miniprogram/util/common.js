const moment = require('moment.min.js');

module.exports = {

  //随机获取一个介于二个数之间的数
  getRandomNumber: (min, max) => {
    return Math.floor(Math.random()*(max - min) + min)
  },

  dateFormat: (d1, str = 'YYYY-MM-DD') => {
    return moment(d1).format(str);
  },

  //现在的时间是在某天之前
  nowIsBefore: (targetDate) => {
    return moment().isBefore(targetDate);
  },

  //在d1天之前，或者就是d1天
  isEqBefore: (d1, d2) => {
    return moment(d1).isBefore(d2) || moment(d1).isSame(d2)
  },

  //在d1天之前
  isBefore: (d1, d2) => {
    return moment(d1).isBefore(d2)
  },

  //在d1天，或者就是d1天
  isEqAfter: (d1, d2) => {
    return moment(d1).isAfter(d2) || moment(d1).isSame(d2)
  },
  
  isAfter: (d1, d2) => {
    return moment(d1).isAfter(d2)
  },

  //计算时间天数差， d1:开始时间，d2:结束时间
  dayDiff: (d1, d2) => {
    
    let dateBegin = new Date(d1).getTime()
    let dateEnd = new Date(d2).getTime()
    let now = new Date().getTime()

    if (dateBegin > now) return 0 //还未开始
    if (dateEnd < now) return -1 //已经结束
    if (dateBegin > dateEnd) return null //开始、结束时间错误

    let timeDiff = dateEnd - dateBegin
    let dayDiff = moment(d2).diff(moment(d1), 'days')

    return dayDiff
  },

  //计算时间数组，输入20190120, 2 返回： [2019-01-20, 2019-01-22], d1: startDate, d2: endDate
  getRangeOfDates: (d1, d2) => {

    let dates = []
    while ( moment(d2).isAfter(d1) ) {
      let d3 = moment(d1).format('YYYY-MM-DD')
      dates.push(d3)
      d1 = moment(d3).add(1, 'days').format('YYYY-MM-DD')
    }
    
    return dates 
    
    // var dates = [],
    //   currentDate = startDate,
    //   addDays = function (days) {
    //     var date = new Date(this.valueOf());
    //     date.setDate(date.getDate() + days);
    //     return date;
    //   };
    // while (currentDate <= endDate) {
    //   dates.push(currentDate.toISOString().split('T')[0]);
    //   currentDate = addDays.call(currentDate, 1);
    // }
    // return dates;
  }

}
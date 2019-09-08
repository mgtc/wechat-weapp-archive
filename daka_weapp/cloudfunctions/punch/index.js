// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: 'daka-21day-staging-946037'
})
const common = require('common')

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()


  let punch_count = await db.collection('activity_punch_data').where({
    _openid: OPENID,
    punch_date: common.formateNowDate()
  }).count()

  if (punch_count.total > 0) 
    return { 
      punch_status: '重复打卡', 
      msg: `用户: ${OPENID} 今天已经打过卡了`
    }

  let punch_result = await db.collection('activity_punch_data').add({
        data: {
          _openid: OPENID,
          punch_date: common.formateNowDate(),
          done: true
        }
      })
  
  if (punch_result.errMsg == 'collection.add:ok')
    return {
      punch_result,
      punch_status: '打卡成功',
      msg: `用户: ${OPENID} 刚刚打卡成功了`
    }

  return {
    punch_result,
    punch_status: '打卡失败',
    msg: `用户: ${OPENID} 打卡失败`
  }

  // return {
  //   event,
  //   OPENID,
  //   APPID,
  //   UNIONID,
  // }
}
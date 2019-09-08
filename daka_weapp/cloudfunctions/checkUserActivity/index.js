// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'daka-21day-staging-946037'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()
  let punch_data = {}
  let punched = false

  let count = await db.collection('activity_users').where({
    _openid: OPENID,
    done: true
  }).count()
  
  if (count.total > 0) {
    punched = true
  }

  await db.collection('activity_punch_data')
    .field({
      punch_date: true
    })
    .where({
      _openid: OPENID,
    })
    .orderBy('create_at', 'desc')
    .limit(100)
    .get().then(res => {
      console.log(res)
      punch_data = res.data
    })
  
  return {
    openid: OPENID,
    punched,
    punch_data
  }
}
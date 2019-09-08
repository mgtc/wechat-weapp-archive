// 价格管理
let  PREFIX = 'http://xxxdomain.com/h5-wealth/'
module.exports = {
    order: {
      url: PREFIX + 'order',
      method: 'POST'
    },
    orderinfo: {
      url: PREFIX + 'orderinfo',
      method: 'POST'
    },
    pay: {
      url: PREFIX + 'pay',
      method: 'POST'
    }
}

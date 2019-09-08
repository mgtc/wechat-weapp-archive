const PREFIX = 'https://xxxdomain.com/h5-wealth/'

const config = {
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

export default config

module.exports = {

  formateNowDate: (type = 1) => {
    switch (type) {
      case 'origin':
        //2019-01-18T03:31:40.374Z
        return new Date().toISOString()
      case '/':
        //2019/01/18
        return new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
      case 'local':
        //2019/1/18 上午11:31:40
        return new Date().toLocaleString().split(',')[0]
      default:
        //2019-01-18
        return new Date().toISOString().split('T')[0]
    }
  },

}
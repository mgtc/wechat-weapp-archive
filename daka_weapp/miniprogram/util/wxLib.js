module.exports = {

  formSubmit: (e, t) => {

    let formId = e.detail.formId
    let formIds = t
    formIds || (formIds = [])

    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime()) + 6048e5
    }

    formIds.push(data)
    console.log(formIds)
    console.log('推送码收集成功！')

    return formIds
  },

  saveFormIds: (e, token, index) => {

    let formIds = e
    let _openid = token
    let hadPunchedDays = index

    if ( 0 != formIds && null != formIds ) {
      console.log(`开始推送给 ${token}`)
      console.log(e)

      wx.request({
        url: 'https://xxxdomain./weapp/saveFormIdBySession',
        method: "POST",
        header: {
          'token': '',
          'content-type': 'application/json' // 默认值
        },
        data: {
          _openid,
          hadPunchedDays,
          formIds
        },
        success: function (e) {
          console.log("提交推送码: " + e.data.msg)
        }
      })
      return []
    }

    return formIds
  }

}

/* eslint-disable camelcase,no-trailing-spaces,space-in-parens */
const {mysql} = require('../qcloud')
const config = require('../config')
const wxLib = require('../tools/wxLib')

/**
 * 获取FormId
 * @private
 * @return Promise
 */
function getFormId (openid) {
    return new Promise(((resolve, reject) => {
        mysql.raw(`select * from formIds where openid = '${openid}' and expire > UNIX_TIMESTAMP(now()) * 1000 order by expire asc limit 1`).then( res => {
            if (res[0][0]) {
                resolve(res[0][0].formid)
            } else {
                console.error(`can't find ${openid} formid`)
            }
            resolve(false)
        })
    }))
}

/**
 * 删除formId
 * @private
 */
function removeFormId (formid) {
    mysql('formIds').where('formid', formid).del().then( result => {
        console.log(`formid: ${formid} delete success \n`)
    })
}

/**
 * 定义消息模板
 * @private
 * @return Object
 */
function createTemplate (openid, count, formid) {
    let touser = openid
    let template_id = config.templateID
    let page = 'pages/index/index'
    let form_id = formid
    let post_data = {
        touser,
        template_id,
        form_id,
        page,
        data: {
            'keyword1': {
                'value': '开卷有益 读书是金'
            },
            'keyword2': {
                'value': `${count}/21`
            },
            'keyword3': {
                'value': '你每一天的进步，也是对Ta们的帮助，点此get新知识！'
            }
        }
    }

    return post_data
}

/**
 * 定时任务：清除七天之前的过期的formIds
 */

function cleanExpireFormIds () {
    let nowTime = new Date().getTime() + 3600 * 1000
    // let nowTime = new Date().getTime() + 24 * 3600 * 1000 * 7
    mysql('formIds').where('expire', '<', nowTime ).del().then( res => {
        console.log(`clean before ${nowTime} expire formIds finish`)
    })
}

/**
 * 发送推送码
 */
async function get (ctx, next) {
    try {
        if (ctx.req.headers.token !== 'AmBg3C2p1sGXPmCxsN8') return 'token is error'
    } catch (e) {
        console.log(e)
    }

    let APPID = config.appId
    let APPSECRET = config.appSecret
    let access_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
    let access_token = ''
    let token_is_availability = false // access_token是否有效
    let expire_in = Date.now()

    // check db access_token is or not expire
    let db_result = await mysql('wechat_config').select('*').orderBy('update_time', 'desc').then()
    if (db_result.length > 0) {
        if (db_result[0].expire_in) {
            if (db_result[0].expire_in > ( Date.now() + 5 * 60 * 1000)) { // 新增时间 5*60*1000 是发送队列消耗时长
                expire_in = db_result[0].expire_in
                access_token = db_result[0].access_token
                token_is_availability = true
            }
        }
    }

    //  check access_token expire status , and get new access_token from server
    if (!token_is_availability) {
        let resp = await wxLib.getUrl(access_token_url)
        if (JSON.parse(resp).access_token) {
            access_token = JSON.parse(resp).access_token
            expire_in = new Date().getTime() + 7200 * 1000 // 过期时间，单位毫秒
        }

        // save or update accss_token to db
        mysql('wechat_config').count('*').then( res => {
            if ( res[0]['count(*)'] === 0 ) {
                mysql('wechat_config').insert({
                    access_token,
                    expire_in,
                    create_time: new Date(),
                    update_time: new Date()
                }).then()
            } else {
                mysql('wechat_config').whereNotNull('access_token').update({
                    access_token,
                    expire_in,
                    update_time: new Date()
                }).then()
            }
        })
    }

    // get all openIds
    mysql('userInfo').select().orderBy('update_time', 'desc').then( async(rows) => {
        console.log(`-----------  new task begin  -----------`)
        for (let item of rows) {
            if (item.openid) {
                console.log(`_openid is: ${item.openid}, update_time is: ${item.update_time} \n`)
                let formid = await getFormId(item.openid)
                
                console.log(`formId is： ${formid} \n`)

                if (formid && access_token !== '') {
                    let send_url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`

                    // console.log(send_url)
                    let message_template = createTemplate(item.openid, item.count, formid)

                    let send_result = await wxLib.postUrl(send_url, message_template)

                    console.log(`send message result is: ${send_result}`)
                    let errcode = JSON.parse(send_result).errcode

                    if (errcode) {
                        if (errcode === '0') {
                            console.log(`openid: ${item.openid} send message success success success! \n`)
                        } else {
                            console.error(`openid: ${item.openid} send message fail! \n`)
                        }
                        if (formid) removeFormId(formid)
                        // del function
                    }
                }
            }
        }
    })

    return ''
}

/**
 * 推送码 入库
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function post (ctx, next) {
    // 处理表单，如formid和openid,并保存入数据库

    console.log(`------------------${new Date()}--------------------------)`)
    // 当POST请求的时候，解析POST表单里的数据，并显示出来
    let postData = ctx.request.body
    console.log(postData)
    let openid = postData._openid ? postData._openid : null
    let hadPunchedDays = postData.hadPunchedDays ? postData.hadPunchedDays : null
    let formIds = postData.formIds ? postData.formIds : null

    // 判断是否是array, 拼装格式 [{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}

    if (Array.isArray(formIds)) {
        // openid 入库并更新
        let user_data = {
            openid,
            count: hadPunchedDays,
            create_time: new Date(),
            update_time: new Date()
        }
        let query = mysql('userInfo').insert(user_data).toString() + ' ON DUPLICATE KEY UPDATE ' + mysql('userInfo').update(user_data).toString().replace(/^update ([`"])[^\1]+\1 set/i, '')
        mysql.raw(query).then()

        // 推送码入库
        let formids_data = []
        formIds.forEach(item => {
            formids_data.push({
                openid,
                formid: item.formId,
                expire: item.expire
            })
        })
        mysql('formIds').select().insert(formids_data).then()
    } else {
        console.log('formIds is not array')
    }

    // console.log(ctx)

    ctx.body = {msg: 'success'}
}

module.exports = {
    cleanExpireFormIds,
    post,
    get
}

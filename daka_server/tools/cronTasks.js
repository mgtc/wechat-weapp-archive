const controllers = require('../controllers')
const CronJob = require('cron').CronJob

const zone = 'Asia/Shanghai'
const sendCronTime = '0 0 19 * * *'
const cleanCronTime = '0 30 5 * * *'
// const cleanCronTime = '*/4 * * * * *'

function onSendMessage () {
    const d = new Date()
    console.log(`tick: ${d}`)
    controllers.formid.get()
}

function onCleanFormId () {
    const d = new Date()
    console.log(`clean job: ${d}`)
    controllers.formid.cleanExpireFormIds()
}

const sendJob = new CronJob(sendCronTime, onSendMessage, null, true, zone)
const cleanJob = new CronJob(cleanCronTime, onCleanFormId, null, true, zone)

sendJob.start()
cleanJob.start()

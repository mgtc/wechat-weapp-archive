const request = require('request')

module.exports = {
    getUrl: (url) => {
        console.log('GET request url ===============')
        return new Promise(function (resolve, reject) {
            request.get(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(response.body)
                } else {
                    // throw new Error(response.statusText)
                    reject('error===')
                }
            })
        })
    },

    postUrl: (url, dataObj) => {
        console.log('POST request url ===============')

        let options = {
            url,
            method: 'POST',
            body: JSON.stringify(dataObj)
        }

        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(response.body)
                } else {
                    // throw new Error(response.statusText)
                    reject('error===')
                }
            })
        })
    }
}

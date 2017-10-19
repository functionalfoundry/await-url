'use strict'

const got = require('got')

const awaitUrl = (url, option) => {
  const config = Object.assign(
    {
      tries: 150,
      interval: 1200,
      logTries: false,
    },
    option
  )

  return new Promise((resolve, reject) => {
    const attempt = async tries => {
      let error = undefined
      let success = false

      for (var attempt = 1; attempt <= tries && !success; attempt++) {
        error = undefined

        if (config.logTries) {
          console.log(`Attempt ${attempt}`)
        }

        try {
          const res = await got(url, {
            followRedirect: false,
            timeout: {
              connect: 10000,
              socket: 10000,
              request: 10000,
            },
          })
          if (res.statusCode === 200) {
            success = true
          } else {
            error = new RangeError(`Expected 200 response but got ${res.statusCode}`)
          }
        } catch (err) {
          error = err
        }
      }

      if (error) {
        throw error
      }
    }

    attempt(config.tries).then(resolve, reject)
  })
}

module.exports = awaitUrl

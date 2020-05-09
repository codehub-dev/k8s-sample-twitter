const express = require('express')
const tweets = require('./v1/tweets.js')
const timeline = require('./v1/timeline.js')

const router = express.Router()

router.use('/v1/tweets', tweets)
router.use('/v1/timeline', timeline)

module.exports = router
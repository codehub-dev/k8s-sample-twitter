const express = require('express');
const model = require('../../models/tweet.js');
const Tweet = model.Tweet;
const router = express.Router();

router.post('/', (req, res, next) => {
  (async () => {
    const userIds = req.body;
    const tweets = await Tweet.find({ userId: { $in: userIds } }, null, {
      sort: { createdAt: -1 },
    }).exec();
    res.status(200).json(tweets);
  })().catch(next);
});

module.exports = router;

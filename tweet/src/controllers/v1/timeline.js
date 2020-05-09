const express = require('express');
const model = require('../../models/tweet.js');
const Tweet = model.Tweet;
const router = express.Router();

/**
 * @swagger
 *
 * /timeline:
 *   post:
 *     description: Get user timeline.
 *     tags:
 *       - timeline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *             example: ['000000000000000000000000', '000000000000000000000001']
 *     responses:
 *       '200':
 *         description: A JSON array of tweets.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tweets'
 */
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

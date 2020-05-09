const express = require('express');
const model = require('../../models/tweet.js');
const Tweet = model.Tweet;
const router = express.Router();

/**
 * @swagger
 *
 * /tweets:
 *   get:
 *     description: Return a list of tweets.
 *     tags:
 *       - tweets
 *     responses:
 *       '200':
 *         description: A JSON array of tweets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tweets'
 */
router.get('/', (req, res, next) => {
  (async () => {
    const tweets = await Tweet.find({}, null, {
      sort: { createdAt: -1 },
    }).exec();
    res.status(200).json(tweets);
  })().catch(next);
});

/**
 * @swagger
 *
 * /tweets/{id}:
 *   get:
 *     description: Find tweet by ID.
 *     tags:
 *       - tweets
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Tweet ID.
 *         schema:
 *           type: string
 *         example: '000000000000000000000000'
 *     responses:
 *       '200':
 *         description: A JSON object of tweet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tweet'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', (req, res, next) => {
  (async () => {
    try {
      const tweet = await Tweet.findById(req.params.id).exec();
      if (tweet) {
        res.status(200).json(tweet);
      } else {
        res.status(404).json({ error: 'NotFound' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

/**
 * @swagger
 *
 * /tweets:
 *   post:
 *     description: Create a tweet.
 *     tags:
 *       - tweets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: '000000000000000000000000'
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 140
 *                 example: 'hello world.'
 *             required:
 *               - userId
 *               - content
 *     responses:
 *       '200':
 *         description: Created tweet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tweet'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', (req, res, next) => {
  (async () => {
    try {
      const record = new Tweet({
        userId: req.body.userId,
        content: req.body.content,
      });
      const savedRecord = await record.save();
      res.status(200).json(savedRecord);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

/**
 * @swagger
 *
 * /tweets/{id}:
 *   delete:
 *     description: Delete a tweet.
 *     tags:
 *       - tweets
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Tweet ID.
 *         schema:
 *           type: string
 *         example: '000000000000000000000000'
 *     responses:
 *       '200':
 *         description: Empty body.
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', (req, res, next) => {
  (async () => {
    try {
      const removedRecord = await Tweet.findByIdAndDelete(req.params.id).exec();
      if (removedRecord) {
        res.status(200).json({});
      } else {
        res.status(404).json({ error: 'NotFound' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

module.exports = router;

const express = require('express');
const model = require('../../models/tweet.js');
const Tweet = model.Tweet;
const router = express.Router();

router.get('/', (req, res, next) => {
  (async () => {
    const tweets = await Tweet.find({}, null, {
      sort: { createdAt: -1 },
    }).exec();
    res.status(200).json(tweets);
  })().catch(next);
});

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

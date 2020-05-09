import * as supertest from 'supertest';
import * as mongoose from 'mongoose';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';

console.error = () => {};
const router = require('../src/controllers/v1/tweets.js');
const model = require('../src/models/tweet.js');
const Tweet = model.Tweet;

const mongod = new MongoMemoryServer();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/tweets', router);

const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();

describe('tweets', () => {
  let tweets: any[] = [];
  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    tweets.length = 0;
    tweets.push(
      await new Tweet({
        userId: user1Id,
        content: 'aaa',
      }).save()
    );
    tweets.push(
      await new Tweet({
        userId: user1Id,
        content: 'bbb',
      }).save()
    );
    tweets.push(
      await new Tweet({
        userId: user2Id,
        content: 'ccc',
      }).save()
    );
    tweets.push(
      await new Tweet({
        userId: user2Id,
        content: 'ddd',
      }).save()
    );
  });

  afterEach(async () => {
    await Tweet.deleteMany().exec();
  });

  // GET /tweets
  test('get tweets', async () => {
    const res = await supertest(app).get('/tweets');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
    expect(res.body[0]._id).toBe(tweets[3]._id.toString());
  });

  // GET /tweets/:id
  test('get tweet', async () => {
    const target = tweets[0];
    const res = await supertest(app).get(`/tweets/${target._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(target._id.toString());
    expect(res.body.userId).toBe(target.userId.toString());
    expect(res.body.content).toBe(target.content);
  });

  test('get tweet not found', async () => {
    const res = await supertest(app).get(
      `/tweets/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  test('get tweet id is invalid', async () => {
    const res = await supertest(app).get('/tweets/invalid');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  // POST /tweets
  test('create tweet', async () => {
    const content = 'xxx';
    const res = await supertest(app)
      .post('/tweets')
      .send({ userId: user1Id.toString(), content: content });
    expect(res.status).toBe(200);
    expect('_id' in res.body).toBeTruthy();
    expect(res.body.content).toBe(content);
  });

  test('create tweet no userId', async () => {
    const content = 'xxx';
    const res = await supertest(app).post('/tweets').send({ content: content });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  test('create tweet no content', async () => {
    const res = await supertest(app)
      .post('/tweets')
      .send({ userId: user1Id.toString() });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  test('create tweet content is empty', async () => {
    const res = await supertest(app)
      .post('/tweets')
      .send({ userId: user1Id.toString(), content: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  test('create tweet content is too long', async () => {
    const res = await supertest(app)
      .post('/tweets')
      // @ts-ignore
      .send({ userId: user1Id.toString(), content: 'a' * 141 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  // DELETE /tweets/:id
  test('delete tweet', async () => {
    const res = await supertest(app).delete(
      `/tweets/${tweets[0]._id}`
    );
    expect(res.status).toBe(200);
    const actual = await Tweet.find();
    expect(actual.length).toBe(3);
  });

  test('delete tweet not found', async () => {
    const res = await supertest(app).delete(
      `/tweets/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  test('delete tweet id is invalid', async () => {
    const res = await supertest(app).delete('/tweets/invalid');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });
});

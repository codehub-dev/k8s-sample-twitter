import * as supertest from 'supertest';
import * as mongoose from 'mongoose';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';

console.error = () => {};
const generator = require('../helpers/generator.ts');
const router = require('../src/controllers/v1/users.js');
const model = require('../src/models/user.js');
const User = model.User;
const users = generator.users;

const mongod = new MongoMemoryServer();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', router);

describe('user', () => {
  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, { useNewUrlParser: true });
  });

  beforeEach(async () => {
    await generator.createData();
  });

  afterEach(async () => {
    await generator.deleteData();
  });

  test('get users', async () => {
    const res = await supertest(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  // GET /users/:id
  test('get user', async () => {
    const userId = users[0]._id.toString();
    const res = await supertest(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId);
    expect(res.body.name).toBe(users[0].name);
  });

  test('get user not found', async () => {
    const res = await supertest(app).get(
      `/users/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  test('get user id is invalid', async () => {
    const res = await supertest(app).get('/users/invalid');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  // POST /users
  test('create user', async () => {
    const name = 'dave';
    const res = await supertest(app).post('/users').send({ name: name });
    expect(res.status).toBe(200);
    expect('_id' in res.body).toBeTruthy();
    expect(res.body.name).toBe(name);
  });

  test('create user name is empty', async () => {
    const res = await supertest(app).post('/users').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  // PUT /users/:id
  test('update user', async () => {
    const name = 'new name';
    const res = await supertest(app)
      .put(`/users/${users[0]._id}`)
      .send({ name: name });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(name);
  });

  test('put user not found', async () => {
    const res = await supertest(app).put(
      `/users/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  test('put user id is invalid', async () => {
    const res = await supertest(app).put('/users/invalid');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });

  // DELETE /users/:id
  test('delete user', async () => {
    const res = await supertest(app).delete(`/users/${users[0]._id}`);
    expect(res.status).toBe(200);
    const actual = await User.find();
    expect(actual.length).toBe(2);
  });

  test('delete user not found', async () => {
    const res = await supertest(app).delete(
      `/users/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  test('delete user id is invalid', async () => {
    const res = await supertest(app).delete('/users/invalid');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'BadRequest' });
  });
});

import * as mongoose from 'mongoose';
const Tweet = require('../src/models/tweet.js').Tweet;

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/tweet';
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
if (process.env.MONGODB_ADMIN_NAME) {
  // @ts-ignore
  options.user = process.env.MONGODB_ADMIN_NAME;
  // @ts-ignore
  options.pass = process.env.MONGODB_ADMIN_PASS;
// @ts-ignore
options.auth = { authSource: 'admin' };
}

const ObjectId = mongoose.Types.ObjectId;
const user1Id = new ObjectId('000000000000000000000000');
const user2Id = new ObjectId('000000000000000000000001');
const tweets = [
  {
    userId: user1Id,
    content: 'Hello World',
    createdAt: '2019-01-01T12:00:00.000Z',
  },
  {
    userId: user1Id,
    content: 'Fizz Buzz',
    createdAt: '2019-01-01T13:00:00.000Z',
  },
  {
    userId: user2Id,
    content: '古池や\n蛙飛びこむ\n水の音',
    createdAt: '2019-01-01T12:01:00.000Z',
  },
  {
    userId: user2Id,
    content: '夏草や\n兵どもが\n夢の跡',
    createdAt: '2019-01-01T12:02:00.000Z',
  },
];

const initialize = async () => {
  await mongoose.connect(dbUrl, options);

  await Tweet.deleteMany().exec();

  await Tweet.insertMany(tweets);
  await mongoose.disconnect();
};

initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('finish.');
  })
  .catch((error) => {
    console.error(error);
  });

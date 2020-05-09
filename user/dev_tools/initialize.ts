import * as mongoose from 'mongoose';
const User = require('../src/models/user.js').User;
const Follow = require('../src/models/follow.js').Follow;

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/user';
const options = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };
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
const user3Id = new ObjectId('000000000000000000000002');
const users = [
  {
    _id: user1Id,
    name: 'alice',
    avatarUrl:
      'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
  },
  {
    _id: user2Id,
    name: 'bob',
    avatarUrl:
      'https://4.bp.blogspot.com/-CtY5GzX0imo/VCIixcXx6PI/AAAAAAAAmfY/AzH9OmbuHZQ/s800/animal_penguin.png',
  },
  {
    _id: user3Id,
    name: 'carol',
    avatarUrl:
      'https://3.bp.blogspot.com/-n0PpkJL1BxE/VCIitXhWwpI/AAAAAAAAmfE/xLraJLXXrgk/s800/animal_hamster.png',
  },
];
const follows = [
  {
    userId: user1Id,
    followId: user2Id,
  },
  {
    userId: user1Id,
    followId: user3Id,
  },
  {
    userId: user2Id,
    followId: user1Id,
  },
];

const initialize = async () => {
  mongoose.connect(dbUrl, options);

  await User.deleteMany().exec();
  await Follow.deleteMany().exec();

  await User.insertMany(users);
  await Follow.insertMany(follows);
  mongoose.disconnect();
};

initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('finish.');
  })
  .catch((error) => {
    console.error(error);
  });

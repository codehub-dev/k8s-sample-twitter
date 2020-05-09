const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tweet = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 140,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

exports.Tweet = mongoose.model('Tweet', Tweet);

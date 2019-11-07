const globalVars = require('../utils/global-vars');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
        type: String,
        required: true
      },
    imageUrl: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }  // this will add createdAt and updatedAt
);

postSchema.statics.postFactory = function(p) {
    // console.log('post.factory:',p);
    const Post = mongoose.model('Post', postSchema);
    const p2 = new Post({
      _id: p._id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      creator: p.creator  //,
      // createdAt: cd,
      // updatedAt: md,
    //   id: p._id.toString(),
      // __v: p.__v
    });
    if (p.createdAt) {
      p2.createdAt = p.createdAt;
    }
    if (p.modifiedAt) {
      p2.modifiedAt = p.createdAt;
    }
    if (p.__v) {
      p2.__v = p.__v;
    }
    // console.log('post.factory:post', p2);
    return p2;
}

module.exports = mongoose.model('Post', postSchema);

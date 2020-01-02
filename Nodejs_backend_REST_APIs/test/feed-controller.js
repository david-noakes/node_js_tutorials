global.appRequire = name => require(`${__dirname}/../${name}`);

const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const FeedController = require('../controllers/feed-controller');
const globalVars = require('../utils/global-vars');
const Post = require('../models/post-model');
const User = require('../models/user-model');

const UserId = '4c0f66b979af55031b34728a';

describe('Feed Controller', function() {
  before(function(done) {
    mongoose
    mongoose
    .connect(
      globalVars.MONGO_Config.MONGO_LOCAL_NODEJS_COURSE_DB,
      {useNewUrlParser: true}
    )
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          _id: UserId
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  after(function(done) {
    User.findByIdAndDelete(UserId)
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc/def',
        filename: 'abcd'
      },
      userId: UserId
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {}).then(savedPost => {
      console.log('saved post:', savedPost);
      expect(savedPost).to.have.property('creator');
      expect(savedPost.creator + '').to.equal(UserId);
      return Post.findByIdAndDelete(savedPost._id);
    }).then(() => {
      done();
    });
  });

});

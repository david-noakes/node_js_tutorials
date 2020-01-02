const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const AuthController = require('../controllers/auth-controller');
const globalVars = require('../utils/global-vars');
const User = require('../models/user-model');

const UserId = '4c0f66b979af55031b34728a';

describe('Auth Controller - tests', function() {
  before(function(done) {
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


  it('should throw an error with code 500 if accessing the database fails', function(done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function(done) {
      const req = { userId: UserId };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.userStatus = data.status;
        }
      };
      AuthController.getUserStatus(req, res, () => {}).then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
        done();
      });
    })

});

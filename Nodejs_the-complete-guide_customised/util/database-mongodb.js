const globals = require('./global-vars');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    // 'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/test?retryWrites=true'
    // 'mongodb+srv://' + globals.MONGO_Config.MONGO_ATLAS_USER +
    //              ':' + globals.MONGO_Config.MONGO_ATLAS_PW +
    //                    globals.MONGO_Config.MONGO_ATLAS_DB_201,
    //                    {useNewUrlParser: true}
    globals.MONGO_Config.MONGO_LOCAL_NODEJS_COURSE_DB,
    {useNewUrlParser: true}
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

const DB_FILEDB = 'filedb';  // via mockdb
const DB_JSONDB = 'jsondb';   // via http
const DB_MOCKDB = 'mockdb';  // via http
const DB_MONGODB = 'mongodb';
const DB_MYSQL = 'mysql';
const DB_SQLZ = 'mysql_slqz';

// local mongo db server = http://localhost:27017


module.exports.environment = {
  // apiUrl: 'http://localhost:3002/api',  // mockdb
  // apiUrl: 'http://localhost:3004/api',  // jsondb
  // apiUrl: 'http://localhost:3006/api',  // mysql
  // apiUrl: 'http://localhost:3006/api',  // mongodb
  apiUrl: '',                          // filedb, mysql, mysql_sequelize
  // dbType: DB_JSONDB,  
  // dbType: DB_MOCKDB,  
  dbType: DB_MONGODB, 
  // dbType: DB_MYSQL,   
  // dbType: DB_SQLZ,   
  // valid types 
  DB_FILEDB: DB_FILEDB,  // via mockdb local
  DB_JSONDB: DB_JSONDB,   // via http
  DB_MOCKDB: DB_MOCKDB,  // via http
  DB_MONGODB: DB_MONGODB, 
  DB_MYSQL: DB_MYSQL, // WITHOUT SEQELIZE
  DB_SQLZ: DB_SQLZ,
};

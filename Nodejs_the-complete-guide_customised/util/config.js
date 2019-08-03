const DB_MOCKDB = 'mockdb';  // via http
const DB_MYSQL = 'mysql';
const DB_MONGODB = 'mongodb';
const DB_FILEDB = 'filedb';  // via mockdb
const DB_JSONDB = 'jsondb';   // via http



module.exports.environment = {
  // apiUrl: 'http://localhost:3002/api',  // mockdb
  apiUrl: 'http://localhost:3004/api',  // jsondb
  // apiUrl: 'http://localhost:3006/api',  // mysql
  // apiUrl: 'http://localhost:3006/api',  // mongodb
  // apiUrl: '',                          // filedb
  // dbType: DB_MOCKDB,   
  // dbType: DB_MYSQL,   
  dbType: DB_JSONDB,  
  // valid types 
  DB_MOCKDB: DB_MOCKDB,  // via http
  DB_MYSQL: DB_MYSQL, 
  DB_MONGODB: DB_MONGODB, 
  DB_FILEDB: DB_FILEDB,  // via mockdb local
  DB_JSONDB: DB_JSONDB   // via http
};

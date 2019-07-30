const mockdb = require('../mockdb/mockdb');

const userTable = "users";

module.exports = class User {
  constructor (
    email, // { type: String, required: true, unique: true },
    password, // { type: String, required: true }
    name, // { type: String, required: true }
    id
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    if (id) {
      this.id = id;
    }
  }

    static fetchAll(cb) {
      mockdb.getCollection(mockdb.tables[userTable], cb);
    }

    static findById(id, cb) {
      mockdb.getDocumentById(mockdb.tables[userTable], id, cb);
    }
    
  static getByEmail(email, cb) {
    mockdb.getDocumentByEmail(userTable, email, cb);
  }

    static findByUser(userId, cb) {
      mockdb.searchDocument(mockdb.tables[userTable], (user) => {
        user.email === userId;
      }, cb);
    }
 
}

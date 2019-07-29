const fs = require("fs");
const path = require('path');
const pathUtil = require('../util/path-util');
const uuidTools = require('./uuid-tools');

const schema = ['carts', 'posts', 'products', 'users'];
var collections = {}; // to be filled

// const mockDB = "jsonDB/mockdata/mockDB.json";
// const mockDB = path.join(pathUtil.mainDir, 'data', 'mockDB.json');
// const productDB = path.join(pathUtil.mainDir, 'data', 'products.json');
// const userDB = path.join(pathUtil.mainDir, 'data', 'users.json');

var filenames = {};

var jsonDB = {};
  
var searchEmail;
var searchId;

function initDB() {
  for (let i = 0; i < schema.length; i++) {  // let s in schema returns the indexes only
    const s = schema[i];
    console.log("schema table = ", s);
    filenames[s] = path.join(pathUtil.mainDir, 'data', s + '.json');
    console.log("filename = ", filenames[s]);
    collections[s] = s;
    console.log("collection = ", collections[s])
    if (!fs.existsSync(filenames[s])) {
      console.log("no " + s + "DB: ", filenames[s]);
      jsonDB[s] = [];
      stowJsonDbCollection(s);
    }
  }
  fetchJsonDbFromFS();
}


function stowJsonDbCollection(w, key, cb) {
  console.log("stowJsonDbCollection:", w);
  if (!w) {
    console.log("stowJsonDbCollection: no collection name given");
    if (cb) {
      cb(null, Error({
        message: "stowJsonDbCollection: no collection name given"
      }));
    } else {
      return Error({
        message: "stowJsonDbCollection: no collection name given"
      });
    }
  }
  if (!filenames[w]) {
    console.log("stowJsonDbCollection: collection name not found");
    if (cb) {
      cb( null, Error({
        message: "stowJsonDbCollection: collection name not found"
      }));
    } else {
      return Error({
        message: "stowJsonDbCollection: collection name not found"
      });
    }
  }
  fs.writeFile(filenames[w], JSON.stringify(jsonDB[w]), err => {
    if (err) {
      console.log("stow failed(" + w + "):", err);
      if (cb) {
        cb(null, Error({
          message: "stow failed(" + w + "):",
          origError: err
        }));
      } else {
        return Error({
          message: "stow failed(" + w + "):",
          origError: err
        });
      }
    } else {
      if (cb) {
        cb({id: key, n: "1"}, null);
      }
    }
  });
}

function fetchJsonDbCollection(w, search, cb) {
  console.log('fetchJsonDbCollection');
  if (!w) {
    console.log("fetchJsonDbCollection: no collection name given");
    return Error({
      message: "fetchJsonDbCollection: no collection name given"
    });
  }
  if (!filenames[w]) {
    console.log("fetchJsonDbCollection: collection name not found");
    return Error({
      message: "fetchJsonDbCollection: collection name not found"
    });
  }
  fs.readFile(filenames[w], "utf8", (err, data) => {
    console.log("fetchJsonDbCollection " + w, "filename = ", filenames[w]);
    if (err){
        console.log(err);
        return err;
    } else {
        console.log("fetch " + w);
        // console.log("data = ", data);
        // console.log("parsed:", jsonDB.posts.length, jsonDB);
        if (!data) {
          jsonDB[w] = [];
        } else {
          const table = JSON.parse(data); //now it an object
          jsonDB[w] = table;
        // console.log("parsed:", jsonDB.posts.length, jsonDB);
      }
      let doc;
      if (search) {
        const idx = jsonDB[w].findIndex(search);
        console.log('search:', idx, search);
        if (idx < 0) {
          return cb(null,  Error({
            message: "fetchJsonDbCollection: document not found"
          }));
        }
        doc = jsonDB[w][idx];
        console.log('search found:', doc);
        if (cb) {
         return cb(doc, null);
        }
      }
      if (cb) {
        // console.log("cb => ", table);
        cb(jsonDB[w].slice(), null);
      }
    }
  });
}

function stowJsonDb() {
  for (let i = 0; i < schema.length; i++) {
    const s = schema[i];
    if (!fs.existsSync(filenames[s])) {
      console.log("no " + s + "DB: ", filenames[s]);
      jsonDB[s] = [];
      stowJsonDbCollection(s);
    } else {
      stowJsonDbCollection(s);
    }
  }
}

function fetchJsonDbFromFS() {
  console.log("fetchJsonDbFromFS:", filenames);
  for (let i = 0; i < schema.length; i++) {
    const s = schema[i];
    console.log("table = ", s, "file = ", filenames[s]);
    if (!fs.existsSync(filenames[s])) {
      console.log("no " + s + "DB: ", filenames[s]);
      jsonDB[s] = [];
      stowJsonDbCollection(s);
    } else {
      fetchJsonDbCollection(s);
    }
  }
}
function initDBOrig() {
  if (!fs.existsSync(mockDB)) {
    jsonDB["users"] = [];
    jsonDB["products"] = [];
    stowJsonDbCollection();
  } else {
    fetchJsonDbCollection();
  }
}

function findByEmail(e, i, a) {
  return e.email === searchEmail;
}

function findById(e, i, a) {
  return e.id === searchId;
}

function validateCollectionName(name) {
  if (schema.indexOf(name) > -1) {
    return null;
  } else {
    const err = new Error();
    err.name = "InvalidCollectionName";
    err.message = "invalid collection name: '" + name + "'";
    return err;
  }
}

function validateDoc(doc) {
  if (doc) {
    return null;
  } else {
    const err = new Error();
    err.name = "NullDocument";
    err.message = "no document supplied, nothing to do";
    return err;
  }
}

function validateKey(searchRequest) {
  if (searchRequest) {
    return null;
  } else {
    const err = new Error();
    err.name = "NullDocumentKey";
    err.message = "no document key supplied, nothing to do";
    return err;
  }
}

function validateSearch(searchRequest) {
  if (searchRequest) {
    return null;
  } else {
    const err = new Error();
    err.name = "NullSearchRequest";
    err.message = "no search request supplied, nothing to do";
    return err;
  }
}

function validateRequest(name, doc) {
  let err = validateCollectionName(name);
  if (!err) {
    err = validateDoc(doc);
  }
  return err;
}

function validateFindRequest(name, key) {
  let err = validateCollectionName(name);
  if (!err) {
    err = validateKey(key);
  }
  return err;
}

function validateSearchRequest(name, searchRequest) {
  let err = validateCollectionName(name);
  if (!err) {
    err = validateSearch(searchRequest);
  }
  return err;
}

function validateUpdateRequest(name, key, doc) {
  let err = validateCollectionName(name);
  if (!err) {
    err = validateKey(key);
  }
  if (!err) {
    err = validateDoc(doc);
  }
  return err;
}

// =====================  Schema Functions ===============

function addDocument(collectionName, doc, callback) {
  const err = validateRequest(collectionName, doc);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
  doc.id = key;
  console.log("doc:", doc);
  jsonDB[collectionName].push(doc);
  stowJsonDbCollection(collectionName, key, callback);
  return key;
}

function deleteDocument(collectionName, key, callback) {
  const err = validateFindRequest(collectionName, key);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  console.log('preparing to delete:', collectionName, ' : ', key);
  const idx = jsonDB[collectionName].findIndex(p => p.id === key);
  if (idx > -1) {
    const doc = jsonDB[collectionName].splice(idx, 1);  // returns the removed item(s)
    stowJsonDbCollection(collectionName, doc, callback);
    if (!callback) {
      return doc;
    }
  } else {
    const s = "deleteDocument: key not found (" + key + ")";
    console.log(s);
    if (callback) {
      callback({id: key, n: "0"}, null);  // n = 0 no match, n > 0 = match
    } else {
      const err = new Error();
      err.name = "KeyNotFound";
      err.message = s;
      return err;
    }
  }
}

function deleteDocumentAuth(collectionName, key, callback) {
  console.log('key:', key);
  const err = validateFindRequest(collectionName, key);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  const idx = jsonDB[collectionName].findIndex(p => p.id === key.id && p.creator === key.creator);
  if (idx > -1) {
    jsonDB[collectionName].splice(idx, 1);  // returns the removed item(s)
    if (key.imagepath) {
      deleteImage(key.imagepath);
    }
    stowJsonDbCollection(collectionName, key, callback);
    if (!callback) {
      return key;
    }
  } else {
    const s = " you are not authorised";
    console.log(s);
    if (callback) {
      callback({id: key.id, creator: key.creator, n: "0"}, null);  // n = 0 no match, n > 0 = match
    } else {
      const err = new Error();
      err.name = "NotAuthorised";
      err.message = s;
      return err;
    }
  }
}

function findDocument(collectionName, searchRequest, callback) {
  const err = validateSearchRequest(collectionName, searchRequest);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  console.log('findDocument');
  if (callback) {
    fetchJsonDbCollection(collectionName, searchRequest, callback);
  } else {
    return jsonDB[collectionName].slice().find(searchRequest);
  }
}

function getCollection(collectionName, callback) {
  const err = validateCollectionName(collectionName);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  if (callback) {
    fetchJsonDbCollection(collectionName, null, callback);
  } else {
    return jsonDB[collectionName].slice();
  }
}

function getDocumentByEmail(collectionName, key, callback) {
  const err = validateFindRequest(collectionName, key);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  searchEmail = key;
  if (callback) {
    fetchJsonDbCollection(collectionName, findByEmail, callback);
  } else {
    return jsonDB[collectionName].slice().find(p => p.email === key);
  }
}

function getDocumentById(collectionName, key, callback) {
  const err = validateFindRequest(collectionName, key);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  searchId = key;
  console.log('getdocumentById:', key);
  if (callback) {
    fetchJsonDbCollection(collectionName, findById, callback);
  } else {
    return jsonDB[collectionName].slice().find(p => p.id === key);
  }
}

function putDocument(collectionName, key, doc, callback) {
  const err = validateUpdateRequest(collectionName, key, doc);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  const idx = jsonDB[collectionName].findIndex(p => p.id === key);
  if (idx > -1) {
    const oldDoc = jsonDB[collectionName][idx];
    const newDoc = { ...oldDoc, ...doc};
    console.log('old:', oldDoc, 'new:', newDoc);
    jsonDB[collectionName][idx] = newDoc;
    stowJsonDbCollection(collectionName, key, callback);
    if (!callback) {
      return newDoc;
    }
  } else {
    const s = "putDocument: key not found (" + key + ")";
    const err = new Error();
    err.name = "KeyNotFound";
    err.message = s;
    if (callback) {
      callback({id: key, n: "0"}, null);  // n = 0 no match, n > 0 = match
    } else {
      return err;
    }
  }
}

function putDocumentAuth(collectionName, key, doc, callback) {
  const err = validateUpdateRequest(collectionName, key, doc);
  if (err) {
    if (callback) {
      return callback(null, err);
    } else {
      return err;
    }
  }
  const idx = jsonDB[collectionName].findIndex(p => p.id === key.id && p.creator === key.creator);
  if (idx > -1) {
    const oldDoc = jsonDB[collectionName][idx];
    const newDoc = { ...oldDoc, ...doc};
    jsonDB[collectionName][idx] = newDoc;
    stowJsonDbCollection(collectionName, key, callback);
    if (!callback) {
      return newDoc;
    }
  } else {
    const s = "putDocumentAuth: you are not authorised";
    const err = new Error();
    err.name = "NotAuthorised";
    err.message = s;
    if (callback) {
      callback(null, err);  // n = 0 no match, n > 0 = match
    } else {
      return err;
    }
  }
}

function searchDocuments(c, search, cb) {
  if (cb) {
    fetchJsonDbCollection(c, search, cb);
  } else {
    return jsonDB[c].slice().filter(search);
  }
}

//==============  carts  ===============

function addCart(p) {
  const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
  const doc = {id: key, ...p};
  jsonDB["carts"].push(doc);
  // stowJsonDbCollection(c);
}

function getCart(key, cb) {
  // getDocumentByEmail("carts", key, cb);
  const idx = jsonDB["carts"].findIndex(p => p.userId === key);
  console.log(jsonDB["carts"], 'idx=', idx);
  if (idx < 0) {
    if (cb) {
      cb(null, "not found");
    } else {
      return null;
    }
  } else {
    const cart = jsonDB["carts"][idx];
    if (cb) {
      cb(cart, null);
    } else {
      return cart;
    }
  }
}

function putCart(key, doc, cb) {
  const idx = jsonDB["carts"].findIndex(p => p.userId === key);
  console.log(jsonDB["carts"], 'idx=', idx);
  if (idx > -1) {
    const oldDoc = jsonDB["carts"][idx];
    let newDoc = {...oldDoc, ...doc };
    jsonDB["carts"][idx] = newDoc;
  } else {
    jsonDB["carts"].push(doc);
  }
  stowJsonDbCollection("carts", key, cb);
  if (!cb) {
    return newDoc;
  }
}
// ====================  images  ===========================
function deleteImage(imagepath)  {
  // console.log('deleteImage:', imagepath);
  const sp = imagepath.split('/');
  // console.log(sp, sp.length);
  let name;
  if (sp.length > 0) {
    fn = sp[sp.length - 1];
    name = path.join(pathUtil.mainDir, 'images', fn);
  }
  console.log('deleteImage:', name);
  if (fs.existsSync(name)) {
    console.log('file exists');
    try {
      fs.unlinkSync(name)
      //file removed
    } catch(err) {
      console.error(err);
    }
  } else {
    console.log('image:', name, "doesn't exist");
  }
}

// exports.stowJsonDbCollection = stowJsonDbCollection;
// exports.fetchJsonDbCollection = fetchJsonDbCollection;
// exports.stowJsonDb = stowJsonDb;
// exports.fetchJsonDbFromFS = fetchJsonDbFromFS;
exports.initDB = initDB;
exports.addDocument = addDocument;
exports.deleteDocument = deleteDocument;
exports.deleteDocumentAuth = deleteDocumentAuth;
exports.findDocument = findDocument; 
exports.getCollection = getCollection;
exports.getDocumentByEmail = getDocumentByEmail;
exports.getDocumentById = getDocumentById;
exports.putDocument = putDocument;
exports.putDocumentAuth = putDocumentAuth;
exports.searchDocuments = searchDocuments;
exports.tables = collections;
exports.addCart = addCart;
exports.getCart = getCart;
exports.putCart = putCart;
exports.deleteImage = deleteImage;
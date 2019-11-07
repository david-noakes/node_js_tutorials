const multer = require('multer');
const globals = require('../utils/global-vars');
const uuidTools = require('../utils/uuid-tools');

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    console.log('imgPath:', globals.imageStorePath);
    cb(error, globals.imageStorePath);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, // name + "-" + 
             globals.dateString() + "-" + 
             uuidTools.generateId('aaaaaaaaaaaaaaaaa') + "." + ext);
    // cb(null, name + "-" + Date.now() + "." + ext);
    // cb(null, name + "-" + globals.dateString() + "." + ext);
    // cb(null, name + "-" + uuidTools.generateId('aaaaaaaaaaaaaaaaa') + "." + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");

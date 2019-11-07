const fs = require('fs');
const globals = require('../utils/global-vars');
const path = require('path');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('** unable to delete file:', filePath, err);
            // throw (err);
        } else {
            console.log('deleted file:', filePath);
        }
    });
}

deleteImage = function(imageToDelete) {
    if (imageToDelete) {
      const parts = imageToDelete.split('/');
      // parts.forEach(element => {
      //   console.log(element);
      // });
      const imgPath = path.join(globals.imageStorePath, '/' + parts[parts.length - 1]);
      console.log('deleting image:', imgPath);
      deleteFile(imgPath);
    }  
}  
  
exports.deleteFile = deleteFile;
exports.deleteImage = deleteImage;

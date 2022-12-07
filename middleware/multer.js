const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    console.log('fileFilter')
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".m4a") {
      console.log('fileFilter failed')
      cb(new Error("File type is not supported"), false);
      return;
    
    }
    console.log('fileFilter passed')
    cb(null, true);
  },
});

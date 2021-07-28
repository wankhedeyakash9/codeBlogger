//Require Multer -> Handles multipart-form-data
const multer = require('multer');
const { extname } = require('path');

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        '-' +
        datetimestamp +
        '.' +
        file.originalname.split('.')[file.originalname.split('.').length - 1],
    );
  },
});

const upload = multer({
  //multer settings
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Limiting file size
  },
  fileFilter: function (req, file, callback) {
    // Allowing only images
    var ext = extname(file.originalname);
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.gif' &&
      ext !== '.jpeg' &&
      ext !== '.xlsx' &&
      ext !== '.kml' &&
      ext !== '.KML' &&
      ext !== '.geojson' &&
      ext !== '.GEOJSON'
    ) {
      return callback(new Error('File type not allowed.'));
    }
    callback(null, true);
  },
});
const fileUpload = multer({
  //multer settings
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Limiting file size
  },
  fileFilter: function (req, file, callback) {
    // Allowing only images
    var ext = extname(file.originalname);
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.gif' &&
      ext !== '.jpeg' &&
      ext !== '.xlsx' &&
      ext !== '.pdf' &&
      ext !== '.mp3' &&
      ext !== '.amr'
    ) {
      return callback(new Error('File type not allowed.'));
    }
    callback(null, true);
  },
});

module.exports = { upload, fileUpload };

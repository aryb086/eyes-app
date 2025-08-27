const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('./errorResponse');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './public/uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, gif)'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Middleware for handling single file upload
const uploadSingle = (fieldName) => (req, res, next) => {
  const uploadSingle = upload.single(fieldName);
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(err.message, 400));
    }
    next();
  });
};

// Middleware for handling multiple file uploads
const uploadMultiple = (fieldName, maxCount) => (req, res, next) => {
  const uploadMultiple = upload.array(fieldName, maxCount);
  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(err.message, 400));
    }
    next();
  });
};

// Middleware for handling file deletion
const deleteFile = (filePath) => {
  if (!filePath) return;
  
  const fullPath = path.join(__dirname, '../public', filePath);
  
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return false;
    }
    console.log('File deleted successfully');
    return true;
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile
};

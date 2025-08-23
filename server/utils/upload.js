const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const ErrorResponse = require('./errorResponse');
const logger = require('./logger');

// Promisify fs.unlink for async/await
const unlinkAsync = promisify(fs.unlink);

// File filter function
const fileFilter = (allowedFileTypes) => (req, file, cb) => {
  try {
    // Check if the file type is allowed
    const filetypes = allowedFileTypes;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }

    const error = new Error(`Error: Only ${allowedFileTypes} files are allowed!`);
    error.status = 400;
    return cb(error, false);
  } catch (error) {
    logger.error(`File filter error: ${error.message}`);
    return cb(error, false);
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

/**
 * Single file upload middleware
 * @param {string} fieldName - Field name for the file
 * @param {RegExp} allowedTypes - Allowed file types (e.g., /jpeg|jpg|png|gif/)
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {Function} - Multer middleware
 */
const uploadSingleFile = (fieldName, allowedTypes, maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    const upload = multer({
      storage,
      fileFilter: fileFilter(allowedTypes),
      limits: { fileSize: maxSize },
    }).single(fieldName);

    upload(req, res, async (err) => {
      try {
        if (err) {
          // Handle multer errors
          if (err.code === 'LIMIT_FILE_SIZE') {
            throw new ErrorResponse(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`, 400);
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            throw new ErrorResponse(`Unexpected field: ${err.field}`, 400);
          }
          throw err;
        }

        // If file was uploaded, add file info to request
        if (req.file) {
          // Add file URL to the file object
          req.file.url = `/uploads/${req.file.filename}`;
          
          // Add file info to request body if needed
          if (!req.body.files) {
            req.body.files = [];
          }
          req.body.files.push(req.file);
        }

        next();
      } catch (error) {
        // Clean up uploaded file if there was an error
        if (req.file && req.file.path) {
          try {
            await unlinkAsync(req.file.path);
          } catch (unlinkError) {
            logger.error(`Error deleting file: ${unlinkError.message}`);
          }
        }
        next(error);
      }
    });
  };
};

/**
 * Multiple files upload middleware
 * @param {string} fieldName - Field name for the files
 * @param {number} maxCount - Maximum number of files (default: 5)
 * @param {RegExp} allowedTypes - Allowed file types (e.g., /jpeg|jpg|png|gif/)
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {Function} - Multer middleware
 */
const uploadMultipleFiles = (fieldName, maxCount = 5, allowedTypes, maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    const upload = multer({
      storage,
      fileFilter: fileFilter(allowedTypes),
      limits: { fileSize: maxSize, files: maxCount },
    }).array(fieldName, maxCount);

    upload(req, res, async (err) => {
      try {
        if (err) {
          // Handle multer errors
          if (err.code === 'LIMIT_FILE_SIZE') {
            throw new ErrorResponse(`One or more files are too large. Maximum size is ${maxSize / (1024 * 1024)}MB`, 400);
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            throw new ErrorResponse(`Unexpected field: ${err.field}`, 400);
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            throw new ErrorResponse(`Maximum ${maxCount} files are allowed`, 400);
          }
          throw err;
        }

        // If files were uploaded, add files info to request
        if (req.files && req.files.length > 0) {
          // Add file URLs to each file object
          req.files = req.files.map(file => ({
            ...file,
            url: `/uploads/${file.filename}`,
          }));
          
          // Add files info to request body if needed
          if (!req.body.files) {
            req.body.files = [];
          }
          req.body.files.push(...req.files);
        }

        next();
      } catch (error) {
        // Clean up uploaded files if there was an error
        if (req.files && req.files.length > 0) {
          await Promise.all(
            req.files.map(async (file) => {
              if (file.path) {
                try {
                  await unlinkAsync(file.path);
                } catch (unlinkError) {
                  logger.error(`Error deleting file: ${unlinkError.message}`);
                }
              }
            })
          );
        }
        next(error);
      }
    });
  };
};

/**
 * Delete file from the filesystem
 * @param {string} filePath - Path to the file
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../public', filePath);
    if (fs.existsSync(fullPath)) {
      await unlinkAsync(fullPath);
      logger.info(`File deleted: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Error deleting file ${filePath}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
};

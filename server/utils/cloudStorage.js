const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('./errorResponse');
const logger = require('./logger');

// Determine the environment
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Google Cloud Storage
let storage;
let bucketName;

if (isProduction) {
  // In production, use environment variables for credentials
  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });
  bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
} else {
  // In development, use local file system for storage
  const localUploadsDir = path.join(__dirname, '../../public/uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
  
  // Mock storage for development
  storage = {
    bucket: () => ({
      file: (filename) => ({
        createWriteStream: () => {
          const filePath = path.join(localUploadsDir, filename);
          return fs.createWriteStream(filePath);
        },
        getSignedUrl: async () => {
          return [`/uploads/${filename}`];
        },
        delete: async () => {
          const filePath = path.join(localUploadsDir, filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        },
      }),
    }),
  };
  bucketName = 'local';
}

/**
 * Upload a file to cloud storage
 * @param {Object} file - File object with buffer, originalname, and mimetype
 * @param {string} folder - Folder to upload the file to (e.g., 'profile-pictures', 'posts')
 * @returns {Promise<Object>} - Uploaded file details
 */
const uploadFile = async (file, folder = 'uploads') => {
  try {
    if (!file) {
      throw new ErrorResponse('No file provided', 400);
    }

    // Generate a unique filename
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    
    // Create a reference to the file in the bucket
    const bucketFile = storage.bucket(bucketName).file(filename);
    
    // Create a write stream to upload the file
    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    // Handle stream events
    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        logger.error('Error uploading file:', err);
        reject(new ErrorResponse('Error uploading file', 500));
      });

      stream.on('finish', async () => {
        try {
          // Make the file public (if needed)
          if (isProduction) {
            await bucketFile.makePublic();
          }
          
          // Get the public URL
          const [url] = isProduction 
            ? await bucketFile.getSignedUrl({
                action: 'read',
                expires: '03-09-2491', // Far future date
              })
            : await bucketFile.getSignedUrl();

          resolve({
            filename: filename,
            url: url,
            contentType: file.mimetype,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        } catch (err) {
          logger.error('Error finalizing file upload:', err);
          reject(new ErrorResponse('Error finalizing file upload', 500));
        }
      });

      // Write the file buffer to the stream
      stream.end(file.buffer);
    });
  } catch (err) {
    logger.error('File upload error:', err);
    throw err;
  }
};

/**
 * Delete a file from cloud storage
 * @param {string} filename - Name of the file to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
const deleteFile = async (filename) => {
  try {
    if (!filename) {
      throw new ErrorResponse('No filename provided', 400);
    }

    const file = storage.bucket(bucketName).file(filename);
    const [exists] = await file.exists();
    
    if (!exists) {
      logger.warn(`File ${filename} does not exist`);
      return false;
    }

    await file.delete();
    logger.info(`File ${filename} deleted successfully`);
    return true;
  } catch (err) {
    logger.error('Error deleting file:', err);
    throw new ErrorResponse('Error deleting file', 500);
  }
};

/**
 * Generate a signed URL for a file
 * @param {string} filename - Name of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - Signed URL
 */
const getSignedUrl = async (filename, expiresIn = 3600) => {
  try {
    if (!filename) {
      throw new ErrorResponse('No filename provided', 400);
    }

    const file = storage.bucket(bucketName).file(filename);
    const [exists] = await file.exists();
    
    if (!exists) {
      throw new ErrorResponse('File not found', 404);
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  } catch (err) {
    logger.error('Error generating signed URL:', err);
    throw err;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getSignedUrl,
};

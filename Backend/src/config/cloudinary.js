const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// multer-storage-cloudinary v4 uses cloudinary v1 (top-level export)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:           'condor/images',
    allowed_formats:  ['jpg', 'jpeg', 'png', 'webp'],
    transformation:   [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'condor/videos',
    resource_type:   'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 },  // 200 MB
});

const deleteFile = (publicId, resourceType = 'image') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

module.exports = { cloudinary, uploadImage, uploadVideo, deleteFile };

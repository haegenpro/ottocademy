import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import { extname } from 'path';

export const multerConfig: MulterOptions = {
  storage: new MulterGoogleCloudStorage({
    bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const baseName = file.originalname.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '-');
      
      let folder = 'others/';
      if (file.fieldname === 'thumbnail_image') {
        folder = 'courses/';
      } else if (file.fieldname === 'pdf_content') {
        folder = 'modules/pdf/';
      } else if (file.fieldname === 'video_content') {
        folder = 'modules/video/';
      }

      cb(null, `${folder}${baseName}-${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = {
      'thumbnail_image': ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      'pdf_content': ['application/pdf'],
      'video_content': ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm']
    };

    const fieldMimes = allowedMimes[file.fieldname as keyof typeof allowedMimes];
    
    if (fieldMimes && fieldMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}.`), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
};

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = '';
      
      // Determine upload path based on file type and field name
      if (file.fieldname === 'thumbnail_image') {
        uploadPath = './public/uploads/courses';
      } else if (file.fieldname === 'pdf_content') {
        uploadPath = './public/uploads/modules/pdf';
      } else if (file.fieldname === 'video_content') {
        uploadPath = './public/uploads/modules/video';
      } else {
        uploadPath = './public/uploads';
      }

      // Create directory if it doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const baseName = file.originalname.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '-');
      cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedMimes = {
      'thumbnail_image': ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      'pdf_content': ['application/pdf'],
      'video_content': ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/x-msvideo']
    };

    const fieldMimes = allowedMimes[file.fieldname as keyof typeof allowedMimes];
    
    if (fieldMimes && fieldMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldMimes?.join(', ')}`), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
};

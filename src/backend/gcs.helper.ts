import { Storage } from '@google-cloud/storage';

const getStorage = () => {
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_KEYFILE || !process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
    console.warn('Google Cloud Storage not configured. File operations will be skipped.');
    return null;
  }

  return new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
  });
};

const getBucket = () => {
  const storage = getStorage();
  if (!storage || !process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
    return null;
  }
  return storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
};

export const deleteFileFromGCS = async (publicUrl: string) => {
  const bucket = getBucket();
  
  if (!bucket || !publicUrl || !process.env.GOOGLE_CLOUD_STORAGE_BUCKET || !publicUrl.includes(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)) {
    console.log('Skipping GCS file deletion - not configured or invalid URL');
    return;
  }

  try {
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
    const path = publicUrl.split(`${bucketName}/`)[1];
    const fileName = path.split('?')[0];
    await bucket.file(fileName).delete();
    console.log(`Successfully deleted ${fileName} from GCS.`);
  } catch (error) {
    console.error(`Failed to delete file from GCS: ${publicUrl}`, error);
  }
};

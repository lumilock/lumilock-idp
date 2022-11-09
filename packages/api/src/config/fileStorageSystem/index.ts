import { fssConstants } from './fssConstants';
import MinioClient from './minio';

// all differents client object storage
const clients = {
  minio: MinioClient,
};

export default clients[fssConstants.fssClient || 'minio'];

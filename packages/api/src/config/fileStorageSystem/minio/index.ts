import * as Minio from 'minio';
import { minioConstants } from './minioConstants';

import { fssConstants } from '../fssConstants';

class MinioClient {
  // minio client default declaration
  minioClient: Minio.Client = new Minio.Client({
    endPoint: minioConstants.endPoint,
    port: Number(minioConstants.port),
    useSSL: Boolean(minioConstants.useSSL === 'true'),
    accessKey: minioConstants.accessKey,
    secretKey: minioConstants.secretKey,
  });

  static staticMinioClient: Minio.Client = new Minio.Client({
    endPoint: minioConstants.endPoint,
    port: Number(minioConstants.port),
    useSSL: Boolean(minioConstants.useSSL === 'true'),
    accessKey: minioConstants.accessKey,
    secretKey: minioConstants.secretKey,
  });

  constructor(
    endPoint = minioConstants.endPoint,
    port = minioConstants.port,
    useSSL = minioConstants.useSSL === 'true',
    accessKey = minioConstants.accessKey,
    secretKey = minioConstants.secretKey,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: endPoint,
      port: Number(port),
      useSSL: Boolean(useSSL),
      accessKey: accessKey,
      secretKey: secretKey,
    });
  }

  get client() {
    return this.minioClient;
  }

  /**
   * Method used to upload a file in a specific minio bucket
   * @param file {File} the file to upload
   * @param path {string} the path of the file inside the bucket
   * @param bucketName {string} name of the bucket
   */
  static async putObject(file, path, bucketName = fssConstants.bucketName) {
    return new Promise((resolve, reject) => {
      this.staticMinioClient.putObject(
        bucketName,
        path,
        file,
        file.length,
        function (err, objInfo) {
          if (err) return reject(err);
          resolve(objInfo);
        },
      );
    });
  }

  static async signedUrl(
    path,
    duration = 24 * 60 * 60, // default 1 days in seconds
    bucketName = fssConstants.bucketName,
  ) {
    return new Promise((resolve, reject) => {
      this.staticMinioClient.presignedUrl(
        'GET',
        bucketName,
        path,
        duration,
        function (err, presignedUrl) {
          if (err) return reject(err);
          resolve(presignedUrl);
        },
      );
    });
  }
}

export default MinioClient;

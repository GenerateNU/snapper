import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { config } from '../config/config';

interface S3Service {
  /**
   * Uploads a file into the s3 bucket
   * @param file to be uploaded
   * @returns the url of the file uploaded to.
   */
  upload(file: File): Promise<string | null>;
  /**
   * Deletes the file at the given url if any is found.
   * @param url
   */
  delete(url: string): Promise<void>;
}

export class S3ServiceImpl implements S3Service {
  private client: S3Client;
  private region: string;
  private awsPublicKey: string;
  private awsSecretKey: string;
  private name: string;

  public constructor() {
    this.region = config.aws.region;
    this.awsPublicKey = config.aws.public;
    this.awsSecretKey = config.aws.private;
    this.name = config.aws.name;
    if (!this.region) throw new Error('AWS region is undefined');
    if (!this.awsPublicKey) throw new Error('AWS public key is undefined');
    if (!this.awsSecretKey) throw new Error('AWS secret key is undefined');
    if (!this.name) throw new Error('AWS Bucket Name not specified');

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.awsPublicKey,
        secretAccessKey: this.awsSecretKey,
      },
    });
  }

  async upload(file: File) {
    const fileKey = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    console.log('Bucket Name:', this.name);
    console.log('Region:', this.region);
    const command = new PutObjectCommand({
      Bucket: this.name,
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });
    try {
      await this.client.send(command);
      const url = `https://${this.name}.s3.${this.region}.amazonaws.com/${fileKey}`;
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async delete(url: string) {
    if (!this.isS3BucketUrl(url)) {
      console.error('Url not found in the s3 bucket.');
      return;
    }
    const key = this.getS3ObjectKey(url);
    if (!key) {
      console.error('Invalid URL.');
      return;
    }
    const command = new DeleteObjectCommand({
      Bucket: this.name,
      Key: key,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  private isS3BucketUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const s3Pattern = /^(.+)\.s3\.[a-z0-9-]+\.amazonaws\.com$/;

      if (s3Pattern.test(parsedUrl.hostname)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid URL:', error);
      return false;
    }
  }

  private getS3ObjectKey(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const objectKey = parsedUrl.pathname.substring(1);
      return objectKey;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }
}

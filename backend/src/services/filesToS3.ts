import { S3ServiceImpl } from './s3Service';

/**
 * Will send the list of files to the s3 bucket and return the urls in a list with the same index.
 *
 * @param files The list of files put into the S3 bucket
 */
export default async function sendFilesToS3(
  files: File[],
): Promise<(string | null)[]> {
  let outListURLs = [];
  const s3Service = new S3ServiceImpl();
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    outListURLs.push(await s3Service.upload(files[fileIndex]));
  }

  return outListURLs;
}

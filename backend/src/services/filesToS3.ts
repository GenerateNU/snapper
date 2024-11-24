import { S3ServiceImpl } from './s3Service';
import { promises as fs } from 'fs';

/**
 * Will send the list of files to the s3 bucket and return the urls in a list with the same index.
 *
 * @param files The list of files put into the S3 bucket
 */
export default async function sendFilesToS3(
  base64s: any[],
): Promise<(string | null)[]> {
  let outListURLs = [];
  const s3Service = new S3ServiceImpl();
  const pending = base64s.map(async (pd) =>
    base64ToFile(pd.base64, pd.name, pd.fileType),
  );
  const files = await Promise.all(pending);
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    outListURLs.push(await s3Service.upload(files[fileIndex]));
  }

  return outListURLs;
}

//This function should be moved.
export function base64ToFile(
  base64String: string,
  fileName: string,
  fileType: string,
): File {
  const base64Data = base64String.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: fileType });

  const file = new File([blob], fileName, { type: fileType });

  return file;
}

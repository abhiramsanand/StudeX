import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as fs from "fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});


export class S3Service {
  async uploadFile(bucketName: string, key: string, filePath: string): Promise<string> {
    try {
      const fileStream = fs.createReadStream(filePath);

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: fileStream,
        },
      });

      await upload.done();
      return `File(s) uploaded successfully to ${bucketName}/${key}`;
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}

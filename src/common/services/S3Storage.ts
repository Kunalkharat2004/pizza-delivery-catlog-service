import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "config";
import { FileData, FileStorage } from "../types/storage";

export class S3Storage implements FileStorage {
    private client: S3Client
    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKeyId"),
                secretAccessKey: config.get("s3.secretAccessKey"),
            },
        });
    }
    async upload(data: FileData): Promise<void> {
        const { fileName, fileData } = data;

        const params = {
            Bucket: config.get("s3.bucket") as string,
            Key: fileName,
            Body: Buffer.from(fileData),
        };

         await this.client.send(new PutObjectCommand(params));
         return;
    }

    async delete(fileName: string): Promise<void> {
        
        const params = {
            Bucket: config.get("s3.bucket") as string,
            Key: fileName,
        }

        await this.client.send(new DeleteObjectCommand(params));
        return;
    }
    getObjectUri(fileName: string):string {

        // Example URL format:
        // https://mern-pizza-app.s3.ap-south-1.amazonaws.com/c5705def-03c6-4a2e-9b46-73a1a8a93123

        const bucket = config.get("s3.bucket") as string;
        const region = config.get("s3.region") as string;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
        return url;
    }
}

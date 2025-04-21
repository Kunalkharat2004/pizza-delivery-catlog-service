import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
    }

    async delete(fileName: string): Promise<void> {
        // Implementation for deleting from S3
    }
    async getObjectUri(fileName: string): Promise<string> {
        // Implementation for getting the object URI from S3
        return `https://your-s3-bucket-url/${fileName}`;
    }
}

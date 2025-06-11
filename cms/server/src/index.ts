import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import multerS3 from "multer-s3";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import * as swaggerJson from "./middleware/__generated__/swagger.json";
import * as swaggerUI from "swagger-ui-express";
import { Request, Response } from "express";
import { RegisterRoutes } from "./middleware/__generated__/routes";
import connectToDatabase from "./data-layer/adapter/mongodb";
import { ErrorRequestHandler } from "express";

export const app = express();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({ origin: "*" }));

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

// ✅ S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ Multer using S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

// Delete file route
app.delete("/api/library/:key", async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key); // Important: S3 keys may contain special characters
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });
    await s3.send(command);
    res.json({ success: true });
  } catch (err) {
    console.error("S3 Delete Error:", err);
    res.status(500).json({ error: "Could not delete file" });
  }
});

app.get("/api/library", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME!,
    });
    const data = await s3.send(command);
    const files =
      data.Contents?.map((item) => ({
        key: item.Key,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        lastModified: item.LastModified
          ? new Date(item.LastModified).toISOString()
          : null, // <-- ADD THIS LINE!
      })) || [];
    res.json(files);
  } catch (err) {
    console.error("S3 List Error:", err);
    res.status(500).json({ error: "Could not list files" });
  }
});

// ✅ Upload endpoint
app.post(
  "/api/upload",
  upload.single("file"),
  (req: Request, res: Response): void => {
    if (!req.file || typeof req.file !== "object") {
      res.status(400).json({ error: "Upload failed" });
      return;
    }

    const fileUrl = (req.file as any).location;
    res.status(200).json({ url: fileUrl });
  },
);

// Swagger + Routes
RegisterRoutes(app);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson));

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, "0.0.0.0", () =>
      console.log(`Server running on port ${port}`),
    );
  } catch (error) {
    console.error("ERROR Connecting to Database", error);
  }
};

app.use(errorHandler);

startServer();

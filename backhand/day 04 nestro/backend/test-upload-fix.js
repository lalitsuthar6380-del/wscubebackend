import cloudinary from "./src/confing/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Readable } from "stream";

// 1x1 pixel PNG (valid PNG)
const pngBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nestro-test",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const testFile = {
  fieldname: "image",
  originalname: "test.png",
  encoding: "7bit",
  mimetype: "image/png",
  stream: Readable.from(pngBuffer),
};

console.log("Testing upload with valid PNG buffer...");

storage._handleFile({ req: {} }, testFile, (err, info) => {
  if (err) {
    console.error("Upload FAILED:", err.message);
    process.exit(1);
  } else {
    console.log("Upload SUCCESS!");
    console.log("Image URL:", info.path);
    process.exit(0);
  }
});


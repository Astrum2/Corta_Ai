import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.resolve(process.cwd(), "uploads", "imagens");

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
]);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const fileName = `image_${Date.now()}${extension}`;

        callback(null, fileName);
    }
});

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (
            !ALLOWED_MIME_TYPES.has(file.mimetype) ||
            !ALLOWED_EXTENSIONS.has(extension)
        ) {
            return callback(
                new Error("Somente imagens JPEG, PNG ou WebP são permitidas.")
            );
        }

        callback(null, true);
    },
});
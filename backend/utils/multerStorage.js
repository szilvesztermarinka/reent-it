import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const multerStorage = (fieldName, multiple = false) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../uploads"));
        },
        filename: (req, file, cb) => {
            const sanitizedFileName = file.originalname
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9.\-_]/g, "_");
            const fileName = `${uuidv4()}-${sanitizedFileName}`;
            cb(null, fileName);
        },
    });

    const upload = multer({ storage });

    return multiple ? upload.array(fieldName) : upload.single(fieldName);
};

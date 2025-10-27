//middlewares/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video and image files are allowed!'), false);
  }
};

const uploadFile = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
}).single("file");

export default uploadFile;
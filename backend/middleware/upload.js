const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Unique filename given here
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

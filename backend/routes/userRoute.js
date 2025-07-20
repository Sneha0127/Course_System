const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 
const { updateProfile, getProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePicture"), updateProfile); //upload from multer middlware

module.exports = router;

const express = require("express");
const router = express.Router();
const { signup, login,getMe,updateCompletedModules } = require("../controllers/authController.js");
// const { getProfile, updateProfile } = require('../controllers/userController');

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe);
router.patch("/update-completed-modules", updateCompletedModules);

module.exports = router;

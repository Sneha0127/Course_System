const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController.js");
// const { getProfile, updateProfile } = require('../controllers/userController');

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;

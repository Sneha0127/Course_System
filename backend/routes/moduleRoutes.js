const express = require('express');

const { createModule, getModulesByCourse, getModule, submitQuiz } = require('../controllers/moduleController.js');

const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.post('/:courseId',auth, createModule);
router.get('/course/:courseId', auth,getModulesByCourse);
router.get("/:moduleId", auth,getModule);
router.post('/:moduleId/quesSet/:quesSetId/submit', auth, submitQuiz);

module.exports = router;

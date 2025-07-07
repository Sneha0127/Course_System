const express = require('express');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  getStudentsInCourse,
  deleteCourse,
  updateCourse,
  removeStudent,
  getCourseById,
} = require("../controllers/courseController");

const auth = require("../middleware/authMiddleware");

// Specific routes first
router.post("/create", auth, createCourse);
router.get("/my-courses", auth, getEnrolledCourses);
router.get("/students/:courseId", auth, getStudentsInCourse);
router.post("/enroll/:courseId", auth, enrollInCourse);
router.delete("/admin/course/:courseId", auth, deleteCourse);
router.put("/admin/course/:courseId", auth, updateCourse);
router.delete("/admin/course/:courseId/student/:studentId", auth, removeStudent);
router.get("/", auth, getAllCourses);
// router.get("/courses/:courseId", getCourseById);
router.get("/:courseId", auth, getCourseById);

module.exports = router;
